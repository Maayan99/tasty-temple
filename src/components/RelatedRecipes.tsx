"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Recipe } from '@/types/recipe';
import { useRelatedRecipes } from '@/hooks/useRelatedRecipes';

interface RelatedRecipesProps {
  recipeSlug: string;
}

const RelatedRecipes: React.FC<RelatedRecipesProps> = ({ recipeSlug }) => {
  const { relatedRecipes, isLoading, error } = useRelatedRecipes(recipeSlug);

  if (isLoading) return <div>Loading related recipes...</div>;
  if (error) return <div>Error loading related recipes</div>;

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.3 }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Related Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedRecipes.map((recipe: Recipe) => (
          <Link href={`/recipe/${recipe.slug}`} key={recipe.id}>
            <motion.div
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative h-48">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  layout="fill"
                  objectFit="cover"
                  unoptimized
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">{recipe.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{recipe.description.substring(0, 80)}...</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-600">{recipe.cookingTime} mins</span>
                  <span className="text-gray-500">{recipe.difficulty}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedRecipes;
