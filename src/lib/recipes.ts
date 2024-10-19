import { PrismaClient } from '@prisma/client';
import { Recipe } from '@/types/recipe';

const prisma = new PrismaClient();

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
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
    },
  });

  if (!recipe) return null;

  return {
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  } as Recipe;
}

export async function getRelatedRecipes(recipeId: number, limit: number = 3): Promise<Recipe[]> {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { categories: { select: { categoryId: true } } },
  });

  if (!recipe) return [];

  const categoryIds = recipe.categories.map((rc) => rc.categoryId);

  const relatedRecipes = await prisma.recipe.findMany({
    where: {
      id: { not: recipeId },
      categories: {
        some: {
          categoryId: { in: categoryIds },
        },
      },
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
    },
    take: limit,
  });

  return relatedRecipes.map((recipe) => ({
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  })) as Recipe[];
}
