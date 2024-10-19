import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LatestRecipes from '@/components/LatestRecipes';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import AnimatedBanner from '@/components/AnimatedBanner';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';

export const metadata: Metadata = {
  title: 'Tasty Temple - Discover Delicious Recipes',
  description: 'Explore a world of culinary delights with Tasty Temple. Find easy-to-follow recipes, cooking tips, and food inspiration.',
  openGraph: {
    title: 'Tasty Temple - Discover Delicious Recipes',
    description: 'Explore a world of culinary delights with Tasty Temple. Find easy-to-follow recipes, cooking tips, and food inspiration.',
    images: [{ url: 'https://tastytemple.com/cover.png' }],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <FeaturedRecipes />
        <LatestRecipes />
        <AnimatedBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
