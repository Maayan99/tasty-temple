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

// Check if the imageUrl is absolute by looking for 'http' or 'https' at the start
  const isAbsoluteUrl = recipe.imageUrl.startsWith('http://') || recipe.imageUrl.startsWith('https://');
  const imageUrl = isAbsoluteUrl ? recipe.imageUrl : `${process.env.NEXT_PUBLIC_SITE_URL}${recipe.imageUrl}`;
  const absoluteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}recipes/${params.id}`;

  return {
    title: `${recipe.title} - Tasty Temple`,
    description: recipe.description,
    keywords: 'cooking, recipes, Tasty Temple, baking',
    openGraph: {
      type: 'article',
      url: absoluteUrl,
      title: `${recipe.title} - Tasty Temple`,
      description: recipe.description,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      siteName: 'Tasty Temple',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} - Tasty Temple`,
      description: recipe.description,
      images: [imageUrl],
    },
    icons: {
      icon: '/favicon.ico',
    },
    themeColor: '#ffffff',
  };
}


export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.id);

  if (!recipe) {
    notFound();
  }

  console.log('Recipe Image URL:', encodeURIComponent(recipe.imageUrl.toLowerCase()));

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
