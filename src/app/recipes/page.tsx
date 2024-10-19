import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeGrid from '@/components/RecipeGrid';
import Newsletter from '@/components/Newsletter';
import { getLatestRecipes } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'Recipes - Tasty Temple',
  description: 'Browse our collection of delicious recipes. From quick and easy meals to gourmet dishes, find your next culinary adventure.',
  openGraph: {
    title: 'Recipes - Tasty Temple',
    description: 'Browse our collection of delicious recipes. From quick and easy meals to gourmet dishes, find your next culinary adventure.',
    images: [{ url: 'https://tastytemple.com/cover.png' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function RecipesPage() {
  const recipes = await getLatestRecipes(12);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Explore Our Recipes</h1>
        <RecipeGrid initialRecipes={recipes} />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}