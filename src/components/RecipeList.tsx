"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Recipe } from '@/types/recipe';
import { useRecipes } from '@/hooks/useRecipes';

const RecipeList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const recipesPerPage = 12;
  const { recipes, isLoading, error, deleteRecipe } = useRecipes(100, 'latest');

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await deleteRecipe(id);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading recipes...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading recipes: {error.message}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search recipes..."
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <AnimatePresence>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
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
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description.substring(0, 100)}...</p>
                <div className="flex justify-between items-center">
                  <Link href={`/admin/edit-recipe/${recipe.id}`} className="text-indigo-600 hover:text-indigo-800 transition duration-300">Edit</Link>
                  <button onClick={() => handleDelete(recipe.id)} className="text-red-500 hover:text-red-700 transition duration-300">Delete</button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="mt-8 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-4 py-2 rounded ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
