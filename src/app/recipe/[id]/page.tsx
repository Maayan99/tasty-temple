import React from 'react';
import { notFound } from 'next/navigation';
import RecipeContent from '@/components/RecipeContent';
import { getRecipeBySlug } from '@/lib/recipes';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeBySlug(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeContent recipe={recipe} />
    </div>
  );
}
