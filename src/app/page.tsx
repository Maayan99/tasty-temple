import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LatestRecipes from '@/components/LatestRecipes';
import AnimatedBanner from '@/components/AnimatedBanner';
import Footer from '@/components/Footer';
import FeaturedCategories from '@/components/FeaturedCategories';
import Newsletter from '@/components/Newsletter';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <LatestRecipes />
        <FeaturedCategories />
        <AnimatedBanner />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
