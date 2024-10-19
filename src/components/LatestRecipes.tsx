"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRecipes } from '@/hooks/useRecipes';

const LatestRecipes: React.FC = () => {
  const { recipes, isLoading, error } = useRecipes(6, 'latest');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading latest recipes</div>;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Latest Recipes
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/recipe/${recipe.id}`}>
                <div className="relative h-48">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 mb-4">{recipe.description.substring(0, 100)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{recipe.cookingTime} mins</span>
                    <span className="text-sm font-semibold text-indigo-600">{recipe.difficulty}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestRecipes;
