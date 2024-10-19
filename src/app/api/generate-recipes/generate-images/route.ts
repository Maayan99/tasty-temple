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
      // Generate all images simultaneously
      const imagePromises = [
        generateImage(recipe.imagePrompt),
        ...recipe.blogImagePrompts.map((prompt: { prompt: string }) => generateImage(prompt.prompt))
      ];

      const generatedImages = await Promise.all(imagePromises);

      // Upload main image to B2
      const mainImageBuffer = Buffer.from(await generatedImages[0].arrayBuffer());
      const mainImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-main-${Date.now()}.png`;
      const mainImageUrl = await uploadToB2(mainImageBuffer, mainImageKey);

      // Upload blog images to B2
      const blogImages = [];
      for (let i = 0; i < recipe.blogImagePrompts.length; i++) {
        const blogImageBuffer = Buffer.from(await generatedImages[i + 1].arrayBuffer());
        const blogImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-blog-${i + 1}-${Date.now()}.png`;
        const blogImageUrl = await uploadToB2(blogImageBuffer, blogImageKey);

        blogImages.push({
          imageUrl: blogImageUrl,
          altText: recipe.blogImagePrompts[i].altText
        });
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

    const response = NextResponse.json({ message: 'Recipes published successfully', publishedRecipes }, { status: 200 });

    // Add headers to prevent caching for error responses too
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error publishing recipes:', error);
    const response = NextResponse.json({
      message: 'Error publishing recipes',
      error: (error as Error).message,
    }, { status: 500 });

    // Add headers to prevent caching for error responses too
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  }
}
