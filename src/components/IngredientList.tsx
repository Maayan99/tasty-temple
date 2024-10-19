"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { RecipeIngredient } from '@/types/recipe';

interface IngredientListProps {
  ingredients: RecipeIngredient[];
  servings: number;
  originalServings: number;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, servings, originalServings }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
      <ul className="space-y-2">
        {ingredients.map((ingredient, index) => (
          <motion.li key={index} variants={itemVariants} className="flex justify-between">
            <span>{ingredient.ingredient.name}</span>
            <span className="font-semibold">
              {((ingredient.quantity * servings) / originalServings).toFixed(2)} {ingredient.ingredient.unit}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default IngredientList;
