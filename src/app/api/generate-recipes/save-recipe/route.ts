import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import { generateRandomComments } from '@/lib/comments';
import { GeneratedRecipe } from '@/types/recipe';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { generatedRecipe, mainImageUrl, blogImages } = await request.json();

  console.log("Received recipe for saving: ", generatedRecipe);
  console.log("Received recipe for saving: ", generatedRecipe.ingredients);
  console.log("Received recipe for saving: ", generatedRecipe.title);
  console.log("Received recipe for saving: ", generatedRecipe.description);
  console.log("Received recipe for saving: ", generatedRecipe.difficulty);
  console.log("Received recipe for saving: ", generatedRecipe.mainImageUrl);
  console.log("Received recipe for saving: ", generatedRecipe.instructions);
  console.log("Received recipe for saving: ", generatedRecipe.nutrition);
  console.log("Received recipe for saving: ", generatedRecipe.blogContent);

  console.log("Received recipe for saving, blogImages: ", blogImages);

  try {
    // Generate random comments
    const comments = await generateRandomComments(generatedRecipe);

    // Save the recipe to the database
    await prisma.recipe.create({
      data: {
        title: generatedRecipe.title,
        slug: slugify(generatedRecipe.title, { lower: true, strict: true }),
        description: generatedRecipe.description,
        cookingTime: generatedRecipe.cookingTime,
        difficulty: generatedRecipe.difficulty,
        servings: generatedRecipe.servings,
        imageUrl: mainImageUrl,
        instructions: generatedRecipe.instructions.join('\n'),
        nutrition: JSON.stringify(generatedRecipe.nutrition),
        blogContent: generatedRecipe.blogContent,
        blogImages: {
          create: blogImages
        },
        ingredients: {
          create: generatedRecipe.ingredients.map((ing: { name: string; quantity: string; unit: string }) => ({
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

    return NextResponse.json({ message: 'Recipe saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving recipe:', error);
    return NextResponse.json({
      message: 'Error saving recipe',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
