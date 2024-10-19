import { PrismaClient } from '@prisma/client';
import { Recipe } from '@/types/recipe';

const prisma = new PrismaClient();

export async function getRecipeBySlug(slug: string): Promise<Recipe | null> {
  const recipe = await prisma.recipe.findUnique({
    where: { slug },
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

export async function getLatestRecipes(limit: number = 6): Promise<Recipe[]> {
  const recipes = await prisma.recipe.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
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

  return recipes.map((recipe) => ({
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  })) as Recipe[];
}

export async function getTrendingRecipes(limit: number = 3): Promise<Recipe[]> {
  // This is a simplified version. In a real application, you might want to
  // implement a more sophisticated algorithm to determine trending recipes.
  const recipes = await prisma.recipe.findMany({
    take: limit,
    orderBy: [
      { ratings: { _count: 'desc' } },
      { comments: { _count: 'desc' } },
    ],
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

  return recipes.map((recipe) => ({
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  })) as Recipe[];
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
