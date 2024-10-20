import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserGenerateRecipeForm from '@/components/UserGenerateRecipeForm';

export default function GenerateRecipePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Generate Your Own Recipe</h1>
        <UserGenerateRecipeForm />
      </main>
      <Footer />
    </div>
  );
}