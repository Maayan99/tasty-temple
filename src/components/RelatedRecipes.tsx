"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Recipe } from '@/types/recipe';
import { useRelatedRecipes } from '@/hooks/useRelatedRecipes';

interface RelatedRecipesProps {
  recipeId: number;
}

const RelatedRecipes: React.FC<RelatedRecipesProps> = ({ recipeId }) => {
  const { relatedRecipes, isLoading, error } = useRelatedRecipes(recipeId);

  if (isLoading) return <div>Loading related recipes...</div>;
  if (error) return <div>Error loading related recipes</div>;

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Related Recipes</h2>
      <div className="space-y-4">
        {relatedRecipes.map((recipe: Recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id}>
            <motion.div
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
              whileHover={{ scale: 1.05 }}
            >
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={80}
                height={80}
                className="rounded-md"
              />
              <div>
                <h3 className="font-semibold">{recipe.title}</h3>
                <p className="text-sm text-gray-600">{recipe.cookingTime} mins | {recipe.difficulty}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedRecipes;
