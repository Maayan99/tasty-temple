import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import LatestRecipes from '@/components/LatestRecipes';
import FeaturedRecipes from '@/components/FeaturedRecipes';
import AnimatedBanner from '@/components/AnimatedBanner';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';

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
