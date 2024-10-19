import { PrismaClient } from '@prisma/client';
import { Category } from '@/types/recipe';

const prisma = new PrismaClient();

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
