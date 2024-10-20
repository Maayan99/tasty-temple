import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeContent from '@/components/RecipeContent';
import { getRecipeBySlug } from '@/lib/recipes';

interface RecipePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.id);

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: `${recipe.title} - Tasty Temple`,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} - Tasty Temple`,
      description: recipe.description,
      images: [{ url: recipe.imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} - Tasty Temple`,
      description: recipe.description,
      images: [recipe.imageUrl],
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
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
