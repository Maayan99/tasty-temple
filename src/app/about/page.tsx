import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutContent from '@/components/AboutContent';
import Newsletter from '@/components/Newsletter';

export const metadata: Metadata = {
  title: 'About Tasty Temple - Our Culinary Journey',
  description: 'Discover the story behind Tasty Temple, our passion for food, and our commitment to bringing you the best recipes and culinary inspiration.',
  openGraph: {
    title: 'About Tasty Temple - Our Culinary Journey',
    description: 'Discover the story behind Tasty Temple, our passion for food, and our commitment to bringing you the best recipes and culinary inspiration.',
    images: [{ url: 'https://tastytemple.com/about-cover.jpg' }],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <AboutContent />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
