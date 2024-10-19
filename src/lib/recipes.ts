import { PrismaClient } from '@prisma/client';
import { Recipe, Category, RecipeCategory } from '@/types/recipe';
import { deleteImageFromB2 } from '@/lib/b2';

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
