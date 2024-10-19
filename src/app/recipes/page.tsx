import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RecipeGrid from '@/components/RecipeGrid';
import RecipeFilter from '@/components/RecipeFilter';
import Newsletter from '@/components/Newsletter';

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Explore Our Recipes</h1>
        <RecipeFilter />
        <RecipeGrid />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}