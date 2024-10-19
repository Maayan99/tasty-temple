import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeContent from '@/components/RecipeContent';
import { getRecipeBySlug } from '@/lib/recipes';

export default async function RecipePage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeBySlug(params.id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecipeContent recipe={recipe} />
      </main>
      <Footer />
    </div>
  );
}
