"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RecipeIngredient } from '@/types/recipe';

interface IngredientListProps {
  ingredients: RecipeIngredient[];
  servings: number;
  originalServings: number;
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, servings, originalServings }) => {
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);

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

  const toggleIngredient = (id: number) => {
    setCheckedIngredients(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      className="mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Ingredients</h2>
      <ul className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
        {ingredients.map((ingredient, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className={`flex justify-between items-center border-b border-gray-100 pb-2 last:border-b-0 last:pb-0 ${checkedIngredients.includes(ingredient.id) ? 'opacity-50' : ''}`}
          >
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedIngredients.includes(ingredient.id)}
                onChange={() => toggleIngredient(ingredient.id)}
                className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className={`text-lg ${checkedIngredients.includes(ingredient.id) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {ingredient.ingredient.name}
              </span>
            </label>
            <span className="font-semibold text-gray-800">
              {((ingredient.quantity * servings) / originalServings).toFixed(2)} {ingredient.ingredient.unit}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default IngredientList;
