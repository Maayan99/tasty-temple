import { NextResponse } from 'next/server';
import { uploadToB2 } from '@/lib/b2';
import slugify from 'slugify';
import { PrismaClient } from '@prisma/client';
import { generateRandomComments } from '@/lib/comments';

const prisma = new PrismaClient();

async function generateImage(prompt: string): Promise<Blob> {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );
  return await response.blob();
}

export async function POST(request: Request) {
  console.log("Received request at generate-images route");
  const { generatedRecipes } = await request.json();

  console.log("Generated Recipes received at image route: ", generatedRecipes);

  try {
    const publishedRecipes = [];

    for (const recipe of generatedRecipes) {
      // Generate main recipe image
      const mainImageBlob = await generateImage(recipe.imagePrompt);
      const mainImageBuffer = Buffer.from(await mainImageBlob.arrayBuffer());
      
      // Upload main image to B2
      console.log("Slugifying main image: ", recipe.title)
      const mainImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-main-${Date.now()}.png`;
      const mainImageUrl = await uploadToB2(mainImageBuffer, mainImageKey);
      console.log("Main image url: ", mainImageUrl);

      // Generate and upload blog images
      const blogImages = [];
      if (recipe.blogImagePrompts) {
        for (let i = 0; i < recipe.blogImagePrompts.length; i++) {
          const imagePrompt = recipe.blogImagePrompts[i];
          const blogImageBlob = await generateImage(imagePrompt.prompt);
          const blogImageBuffer = Buffer.from(await blogImageBlob.arrayBuffer());

          console.log("Slugifying blog image ", i, recipe.title)
          const blogImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-blog-${i + 1}-${Date.now()}.png`;
          const blogImageUrl = await uploadToB2(blogImageBuffer, blogImageKey);

          blogImages.push({
            imageUrl: blogImageUrl,
            altText: imagePrompt.altText
          });
        }
      }

      // Generate random comments
      const comments = await generateRandomComments(recipe);

      // Save the recipe to the database
      const savedRecipe = await prisma.recipe.create({
        data: {
          title: recipe.title,
          slug: slugify(recipe.title, { lower: true, strict: true }),
          description: recipe.description,
          cookingTime: recipe.cookingTime,
          difficulty: recipe.difficulty,
          servings: recipe.servings,
          imageUrl: mainImageUrl,
          instructions: recipe.instructions.join('\n'),
          nutrition: recipe.nutrition,
          blogContent: recipe.blogContent,
          blogImages: {
            create: blogImages
          },
          ingredients: {
            create: recipe.ingredients.map((ing: { name: string; quantity: string; unit: string }) => ({
              quantity: parseFloat(ing.quantity),
              ingredient: {
                connectOrCreate: {
                  where: { name: ing.name },
                  create: { name: ing.name, unit: ing.unit },
                },
              },
            })),
          },
          comments: {
            create: comments
          }
        },
      });

      publishedRecipes.push(savedRecipe);
    }

    return NextResponse.json({ message: 'Recipes published successfully', publishedRecipes }, { status: 200 });
  } catch (error) {
    console.error('Error publishing recipes:', error);
    return NextResponse.json({
      message: 'Error publishing recipes',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
