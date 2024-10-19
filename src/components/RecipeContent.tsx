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
    >
      <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="relative w-full h-96 mb-6"
          >
            <Image
              src={recipe.imageUrl}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <p className="text-lg mb-4">{recipe.description}</p>
            <div className="flex gap-4 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                {recipe.cookingTime} mins
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {recipe.difficulty}
              </span>
            </div>
          </motion.div>
          <ServingAdjuster servings={servings} setServings={setServings} />
          <IngredientList ingredients={recipe.ingredients} servings={servings} originalServings={recipe.servings} />
          <InstructionList instructions={recipe.instructions} />
        </div>
        <div className="md:w-1/3">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Nutrition Information</h2>
            {/* Add nutrition information here */}
          </motion.div>
          <RelatedRecipes recipeId={recipe.id} />
        </div>
      </div>
      <CommentSection recipeId={recipe.id} />
    </motion.div>
  );
};

export default RecipeContent;
