"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { name: 'Breakfast', icon: '🍳', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Lunch', icon: '🥪', color: 'bg-green-100 text-green-800' },
  { name: 'Dinner', icon: '🍽️', color: 'bg-blue-100 text-blue-800' },
  { name: 'Desserts', icon: '🍰', color: 'bg-pink-100 text-pink-800' },
  { name: 'Vegetarian', icon: '🥗', color: 'bg-lime-100 text-lime-800' },
  { name: 'Vegan', icon: '🌱', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'Gluten-Free', icon: '🌾', color: 'bg-amber-100 text-amber-800' },
  { name: 'Keto', icon: '🥑', color: 'bg-purple-100 text-purple-800' },
  { name: 'Quick & Easy', icon: '⏱️', color: 'bg-red-100 text-red-800' },
  { name: 'Slow Cooker', icon: '🍲', color: 'bg-orange-100 text-orange-800' },
  { name: 'Grilling', icon: '🍖', color: 'bg-rose-100 text-rose-800' },
  { name: 'Baking', icon: '🍞', color: 'bg-indigo-100 text-indigo-800' },
];

const CategoryList: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <motion.div key={category.name} variants={itemVariants}>
          <Link href={`/category/${category.name.toLowerCase().replace(' & ', '-')}`}>
            <div className={`${category.color} rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer`}>
              <div className="p-6 flex flex-col items-center">
                <span className="text-4xl mb-4">{category.icon}</span>
                <h2 className="text-2xl font-semibold text-center">{category.name}</h2>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryList;
