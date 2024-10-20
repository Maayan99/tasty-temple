import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AIRecipeSection from '@/components/AIRecipeSection';
import LatestRecipes from '@/components/LatestRecipes';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import AnimatedBanner from '@/components/AnimatedBanner';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { getLatestRecipes, getFeaturedRecipes } from '@/lib/recipes';

export const metadata: Metadata = {
  title: 'Tasty Temple - Discover Delicious Recipes',
  description: 'Explore a world of culinary delights with Tasty Temple. Find easy-to-follow recipes, cooking tips, and food inspiration.',
  openGraph: {
    title: 'Tasty Temple - Discover Delicious Recipes',
    description: 'Explore a world of culinary delights with Tasty Temple. Find easy-to-follow recipes, cooking tips, and food inspiration.',
    images: [{ url: 'https://tastytemple.com/cover.png' }],
  },
};

export default async function Home() {
  const latestRecipes = await getLatestRecipes(6);
  const featuredRecipes = await getFeaturedRecipes(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero recipes={featuredRecipes} />
        <AIRecipeSection />
        <FeaturedRecipes recipes={featuredRecipes} />
        <LatestRecipes recipes={latestRecipes} />
        <AnimatedBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
