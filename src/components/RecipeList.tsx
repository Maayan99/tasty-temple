"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Recipe } from '@/types/recipe';
import { useRecipes } from '@/hooks/useRecipes';

const RecipeList: React.FC = () => {
  const { recipes, isLoading, error, deleteRecipe } = useRecipes(100, 'latest');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipe(id);
    }
  };

  if (isLoading) return <div>Loading recipes...</div>;
  if (error) return <div>Error loading recipes: {error.message}</div>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search recipes..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            <p className="text-gray-600 mb-4">{recipe.description.substring(0, 100)}...</p>
            <div className="flex justify-between items-center">
              <Link href={`/admin/edit-recipe/${recipe.id}`} className="text-blue-500 hover:underline">Edit</Link>
              <button onClick={() => handleDelete(recipe.id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecipeList;
