"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/recipe';
import { motion } from 'framer-motion';

interface RecipeEditorProps {
  recipe: Recipe;
}

const RecipeEditor: React.FC<RecipeEditorProps> = ({ recipe }) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe>(recipe);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedRecipe),
      });

      if (!response.ok) {
        throw new Error('Failed to update recipe');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={editedRecipe.title}
          onChange={handleInputChange}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={editedRecipe.description}
          onChange={handleInputChange}
          rows={3}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">Cooking Time (minutes)</label>
        <input
          type="number"
          id="cookingTime"
          name="cookingTime"
          value={editedRecipe.cookingTime}
          onChange={handleInputChange}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
        <select
          id="difficulty"
          name="difficulty"
          value={editedRecipe.difficulty}
          onChange={handleInputChange}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div>
        <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Servings</label>
        <input
          type="number"
          id="servings"
          name="servings"
          value={editedRecipe.servings}
          onChange={handleInputChange}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>

      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={editedRecipe.instructions}
          onChange={handleInputChange}
          rows={10}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>

      <div>
        <label htmlFor="blogContent" className="block text-sm font-medium text-gray-700">Blog Content</label>
        <textarea
          id="blogContent"
          name="blogContent"
          value={editedRecipe.blogContent}
          onChange={handleInputChange}
          rows={15}
          className="text-black mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        ></textarea>
      </div>

      {error && (
        <div className="text-red-500">{error}</div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        className="text-black w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? 'Updating...' : 'Update Recipe'}
      </motion.button>
    </motion.form>
  );
};

export default RecipeEditor;
