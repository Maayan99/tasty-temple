import { PrismaClient } from '@prisma/client';
import { Recipe, Category, RecipeCategory } from '@/types/recipe';
import { deleteImageFromB2 } from '@/lib/b2';

const prisma = new PrismaClient();

// ... (keep existing functions)

export async function deleteRecipeById(id: number): Promise<void> {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: { blogImages: true }
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Delete main image from B2
  await deleteImageFromB2(recipe.imageUrl);

  // Delete blog images from B2
  for (const blogImage of recipe.blogImages) {
    await deleteImageFromB2(blogImage.imageUrl);
  }

  // Delete recipe and related data from database
  await prisma.recipe.delete({
    where: { id },
  });
}

export async function updateRecipe(id: number, data: Partial<Recipe>): Promise<Recipe> {
  const updatedRecipe = await prisma.recipe.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      cookingTime: data.cookingTime,
      difficulty: data.difficulty,
      servings: data.servings,
      instructions: data.instructions,
      nutrition: JSON.stringify(data.nutrition),
      blogContent: data.blogContent,
    },
    include: {
      ingredients: {
        include: {
          ingredient: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      blogImages: true,
      comments: true,
    },
  });

  return {
    ...updatedRecipe,
    nutrition: JSON.parse(updatedRecipe.nutrition as string),
    createdAt: updatedRecipe.createdAt.toISOString(),
    updatedAt: updatedRecipe.updatedAt.toISOString(),
    categories: updatedRecipe.categories.map((rc): RecipeCategory => ({
      id: rc.id,
      category: {
        ...rc.category,
        slug: rc.category.name.toLowerCase().replace(/ /g, '-'),
        recipeCount: 0,
      },
    })),
    blogImages: updatedRecipe.blogImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
    })),
  } as Recipe;
}
