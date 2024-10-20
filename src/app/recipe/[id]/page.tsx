import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeContent from '@/components/RecipeContent';
import { getRecipeBySlug } from '@/lib/recipes';
import { Recipe } from '@/types/recipe';

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
  };
}

function generateSchemaOrgScript(recipe: Recipe): string {
  const schemaOrgData = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description,
    image: recipe.imageUrl,
    author: {
      '@type': 'Organization',
      name: 'Tasty Temple',
    },
    datePublished: recipe.createdAt,
    prepTime: `PT${recipe.cookingTime}M`,
    cookTime: `PT${recipe.cookingTime}M`,
    totalTime: `PT${recipe.cookingTime}M`,
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: recipe.categories.map(cat => cat.category.name).join(', '),
    recipeCuisine: recipe.categories.map(cat => cat.category.name).join(', '),
    recipeIngredient: recipe.ingredients.map(ing => `${ing.quantity} ${ing.ingredient.unit} ${ing.ingredient.name}`),
    recipeInstructions: recipe.instructions.split('\n').map(step => ({
      '@type': 'HowToStep',
      text: step,
    })),
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${recipe.nutrition.calories} calories`,
      proteinContent: `${recipe.nutrition.protein}g`,
      carbohydrateContent: `${recipe.nutrition.carbs}g`,
      fatContent: `${recipe.nutrition.fat}g`,
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schemaOrgData)}</script>`;
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipeBySlug(params.id);

  if (!recipe) {
    notFound();
  }

  const schemaOrgScript = generateSchemaOrgScript(recipe);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <RecipeContent recipe={recipe} />
      </main>
      <Footer />
      <div dangerouslySetInnerHTML={{ __html: schemaOrgScript }} />
    </div>
  );
}
