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
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Related Recipes</h2>
      <div className="space-y-6">
        {relatedRecipes.map((recipe: Recipe) => (
          <Link href={`/recipe/${recipe.slug}`} key={recipe.id}>
            <motion.div
              className="flex items-center space-x-4 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{recipe.title}</h3>
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
