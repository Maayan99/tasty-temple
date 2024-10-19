"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import { useRecipes } from '@/hooks/useRecipes';
import { useSearchParams } from 'next/navigation';

interface RecipeGridProps {
  initialRecipes: Recipe[];
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ initialRecipes }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const { recipes: searchedRecipes, isLoading, error } = useRecipes(12, 'search', searchTerm);

  useEffect(() => {
    if (searchTerm) {
      setRecipes(searchedRecipes);
    } else {
      setRecipes(initialRecipes);
    }
  }, [searchTerm, searchedRecipes, initialRecipes]);

  if (isLoading) return <div>Searching recipes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (recipes.length === 0) {
    return <div>No recipes found.</div>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Link href={`/recipe/${recipe.slug}`}>
            <div className="relative h-64">
              <Image
                src={recipe.imageUrl}
                alt={recipe.title}
                layout="fill"
                objectFit="cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">{recipe.title}</h3>
                <div className="flex justify-between items-center text-white text-sm">
                  <span className="bg-indigo-600 px-2 py-1 rounded">{recipe.cookingTime} mins</span>
                  <span className="font-semibold">{recipe.difficulty}</span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">{recipe.description.substring(0, 100)}...</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-600 font-semibold">View Recipe</span>
                <span className="text-gray-500">{new Date(recipe.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default RecipeGrid;
