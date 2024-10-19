import React from 'react';
import Hero from '@/components/Hero';
import LatestRecipes from '@/components/LatestRecipes';
import AnimatedBanner from '@/components/AnimatedBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Hero />
      <LatestRecipes />
      <AnimatedBanner />
    </div>
  );
}
