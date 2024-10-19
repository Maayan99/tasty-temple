import { PrismaClient } from '@prisma/client';
import { Recipe, Category, RecipeCategory } from '@/types/recipe';

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
      blogImages: true,
      comments: true,
    },
  });

  if (!recipe) return null;

  return {
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    categories: recipe.categories.map((rc): RecipeCategory => ({
      id: rc.id,
      category: {
        ...rc.category,
        slug: rc.category.name.toLowerCase().replace(/ /g, '-'),
        recipeCount: 0, // You might want to fetch this separately if needed
      },
    })),
    blogImages: recipe.blogImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
    })),
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
      blogImages: true,
      comments: true,
    },
  });

  return recipes.map((recipe) => ({
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    categories: recipe.categories.map((rc): RecipeCategory => ({
      id: rc.id,
      category: {
        ...rc.category,
        slug: rc.category.name.toLowerCase().replace(/ /g, '-'),
        recipeCount: 0, // You might want to fetch this separately if needed
      },
    })),
    blogImages: recipe.blogImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
    })),
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
      blogImages: true,
      comments: true,
    },
  });

  return recipes.map((recipe) => ({
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    categories: recipe.categories.map((rc): RecipeCategory => ({
      id: rc.id,
      category: {
        ...rc.category,
        slug: rc.category.name.toLowerCase().replace(/ /g, '-'),
        recipeCount: 0, // You might want to fetch this separately if needed
      },
    })),
    blogImages: recipe.blogImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
    })),
  })) as Recipe[];
}

export async function getRelatedRecipes(recipeSlug: string, limit: number = 3): Promise<Recipe[]> {
  const recipe = await prisma.recipe.findUnique({
    where: { slug: recipeSlug },
    include: { categories: { select: { categoryId: true } } },
  });

  if (!recipe) return [];

  const categoryIds = recipe.categories.map((rc) => rc.categoryId);

  const relatedRecipes = await prisma.recipe.findMany({
    where: {
      slug: { not: recipeSlug },
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
      blogImages: true,
      comments: true,
    },
    take: limit,
  });

  return relatedRecipes.map((recipe) => ({
    ...recipe,
    nutrition: JSON.parse(recipe.nutrition as string),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
    categories: recipe.categories.map((rc): RecipeCategory => ({
      id: rc.id,
      category: {
        ...rc.category,
        slug: rc.category.name.toLowerCase().replace(/ /g, '-'),
        recipeCount: 0, // You might want to fetch this separately if needed
      },
    })),
    blogImages: recipe.blogImages.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
    })),
  })) as Recipe[];
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { recipes: true },
      },
    },
  });

  return categories.map((category) => ({
    ...category,
    recipeCount: category._count.recipes,
    slug: category.name.toLowerCase().replace(/ /g, '-'),
  }));
}
