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
        ...recipe.blogImagePrompts.map((prompt: any) => generateImage(prompt.prompt))
      ];

      const generatedImages = await Promise.all(imagePromises);

      // Upload main image to B2
      const mainImageBuffer = Buffer.from(await generatedImages[0].arrayBuffer());
      console.log("Slugifying main image: ", recipe.title);
      const mainImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-main-${Date.now()}.png`;
      const mainImageUrl = await uploadToB2(mainImageBuffer, mainImageKey);
      console.log("Main image url: ", mainImageUrl);

      // Upload blog images to B2
      const blogImages = [];
      for (let i = 0; i < recipe.blogImagePrompts.length; i++) {
        const blogImageBuffer = Buffer.from(await generatedImages[i + 1].arrayBuffer());
        console.log("Slugifying blog image ", i, recipe.title);
        const blogImageKey = `recipes/${slugify(recipe.title, { lower: true, strict: true })}-blog-${i + 1}-${Date.now()}.png`;
        const blogImageUrl = await uploadToB2(blogImageBuffer, blogImageKey);
        blogImages.push({
          imageUrl: blogImageUrl,
          altText: recipe.blogImagePrompts[i].altText
        });
      }

      // Generate random comments
      const comments = await generateRandomComments(recipe);

      console.log("About to save: ", recipe.title);
      console.log("About to save: ", recipe.description);
      console.log("About to save: ", recipe.cookingTime);
      console.log("About to save: ", recipe.difficulty);
      console.log("About to save: ", recipe.servings);
      console.log("About to save: ", mainImageUrl);
      console.log("About to save: ", recipe.instructions.join('\n'));
      console.log("About to save: ", recipe.nutrition);
      console.log("About to save: ", recipe.blogContent);
      console.log("About to save: ", recipe.ingredients);
      console.log("About to save: ", comments);

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
          blogContent: (typeof recipe.blogContent === 'string' ? recipe.blogContent : (recipe.blogContent?.join('\n') || "")),
          blogImages: {
            create: blogImages
          },
          ingredients: {
            create: recipe.ingredients.map((ing: { name: string; quantity: string; unit: string }) => ({
              quantity: parseInt(ing.quantity) || 1,
              ingredient: {
                connectOrCreate: {
                  where: { name: ing.name },
                  create: { name: ing.name, unit: ing.unit || "" },
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
  } catch (error: any) {
    console.error('Error publishing recipes:', error);
    console.error('Error publishing recipes:', error.message);
    console.error('Error publishing recipes:', error.message.substring(0, 100));
    console.error('Error publishing recipes:', error.message.substring(1000, 2000));
    console.error('Error publishing recipes:', error.message.substring(2000, 3000));
    console.error('Error publishing recipes:', error.message.substring(3000, 4000));
    console.error('Error publishing recipes:', error.message.substring(4000, 5000));
    console.error('Error publishing recipes:', error.message.substring(5000, 6000));
    console.error('Error publishing recipes:', error.message.substring(6000, 7000));
    console.error('Error publishing recipes:', error.message.substring(7000, 8000));
    console.error('Error publishing recipes:', error.message.substring(8000, 9000));
    console.error('Error publishing recipes:', error.message.substring(9000, 10000));
    console.error('Error publishing recipes:', error.message.substring(10000, 11000));
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
