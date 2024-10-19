"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Recipe } from '@/types/recipe';
import ServingAdjuster from './ServingAdjuster';
import IngredientList from './IngredientList';
import InstructionList from './InstructionList';
import RelatedRecipes from './RelatedRecipes';
import CommentSection from './CommentSection';

interface RecipeContentProps {
  recipe: Recipe;
}

const RecipeContent: React.FC<RecipeContentProps> = ({ recipe }) => {
  const [servings, setServings] = useState(recipe.servings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-sans max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 tracking-tight">{recipe.title}</h1>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden shadow-lg"
      >
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="mb-8"
      >
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{recipe.description}</p>
        <div className="flex flex-wrap gap-4 mb-8">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            {recipe.cookingTime} mins
          </span>
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            {recipe.difficulty}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
            {recipe.servings} servings
          </span>
        </div>
      </motion.div>
      <ServingAdjuster servings={servings} setServings={setServings} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <IngredientList ingredients={recipe.ingredients} servings={servings} originalServings={recipe.servings} />
          <InstructionList instructions={recipe.instructions} />
        </div>
        <div className="md:col-span-1">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="bg-gray-50 p-6 rounded-2xl shadow-md mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nutrition Information</h2>
            <ul className="space-y-2">
              {Object.entries(recipe.nutrition).map(([key, value]) => (
                <li key={key} className="flex justify-between items-center">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className="font-semibold text-gray-800">{value}g</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <RelatedRecipes recipeSlug={recipe.slug} />
        </div>
      </div>
      <CommentSection recipeId={recipe.id} />
    </motion.div>
  );
};

export default RecipeContent;
