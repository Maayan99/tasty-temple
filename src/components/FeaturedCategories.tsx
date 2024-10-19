"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { name: 'Breakfast', icon: '🍳' },
  { name: 'Lunch', icon: '🥪' },
  { name: 'Dinner', icon: '🍽️' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Vegetarian', icon: '🥗' },
  { name: 'Gluten-Free', icon: '🌾' },
];

const FeaturedCategories: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Featured Categories
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/category/${category.name.toLowerCase()}`}>
                <div className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <span className="text-4xl mb-4 block">{category.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
