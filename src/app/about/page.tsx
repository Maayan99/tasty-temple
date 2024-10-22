import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutContent from '@/components/AboutContent';
import Newsletter from '@/components/Newsletter';

export const metadata: Metadata = {
  title: 'About Tasty Temple - AI-Powered Culinary Innovation',
  description: 'Discover how Tasty Temple is revolutionizing recipe creation with AI, empowering users to craft and share personalized culinary experiences.',
  openGraph: {
    title: 'About Tasty Temple - AI-Powered Culinary Innovation',
    description: 'Discover how Tasty Temple is revolutionizing recipe creation with AI, empowering users to craft and share personalized culinary experiences.',
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
