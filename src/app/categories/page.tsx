import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryList from '@/components/CategoryList';
import Newsletter from '@/components/Newsletter';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Recipe Categories</h1>
        <CategoryList />
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}
