"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';

const CategoryList: React.FC = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories</div>;

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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <Link href={`/category/${category.slug}`}>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{category.name}</h2>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600 font-semibold">View Recipes</span>
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {category.recipeCount} recipes
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategoryList;
