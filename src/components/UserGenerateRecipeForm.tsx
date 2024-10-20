"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UserGenerateRecipeForm: React.FC = () => {
  const [direction, setDirection] = useState('');
  const [recipeIdea, setRecipeIdea] = useState<{ title: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullRecipe, setFullRecipe] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRecipeIdea(null);

    try {
      const response = await fetch('/api/generate-recipes/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipe idea');
      }

      const data = await response.json();
      setRecipeIdea(data.recipeIdeas[0]);
    } catch (err) {
      setError('Error generating recipe idea. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFullRecipe = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-recipes/generate-full-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeIdeas: [recipeIdea] }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate full recipe');
      }

      const data = await response.json();
      setFullRecipe(data.generatedRecipes[0]);
    } catch (err) {
      setError('Error generating full recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishRecipe = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-recipes/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedRecipes: [fullRecipe] }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish recipe');
      }

      const data = await response.json();
      const publishedRecipe = data.publishedRecipes[0];
      router.push(`/recipe/${publishedRecipe.slug}`);
    } catch (err) {
      setError('Error publishing recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white shadow-xl rounded-lg p-8"
    >
      {!recipeIdea && (
        <form onSubmit={handleSubmit} className="mb-8">
          <motion.textarea
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            placeholder="Enter a direction for your recipe idea..."
            className="w-full text-black p-4 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            initial={{ scale: 0.95 }}
            whileFocus={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Generating...' : 'Generate Recipe Idea'}
          </motion.button>
        </form>
      )}

      {recipeIdea && !fullRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-inner mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{recipeIdea.title}</h2>
          <p className="text-gray-600 mb-6">{recipeIdea.description}</p>
          <div className="flex justify-between">
            <motion.button
              onClick={() => setRecipeIdea(null)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
            <motion.button
              onClick={handleGenerateFullRecipe}
              className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Generate Full Recipe
            </motion.button>
          </div>
        </motion.div>
      )}

      {fullRecipe && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg shadow-inner mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{fullRecipe.title}</h2>
          <p className="text-gray-600 mb-4">{fullRecipe.description}</p>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc pl-5">
              {fullRecipe.ingredients.map((ingredient: any, index: number) => (
                <li key={index}>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal pl-5">
              {fullRecipe.instructions.map((instruction: string, index: number) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Image Prompts:</h3>
            <p>{fullRecipe.imagePrompt}</p>
            {fullRecipe.blogImagePrompts.map((prompt: any, index: number) => (
              <p key={index}>{prompt.prompt}</p>
            ))}
          </div>
          <motion.button
            onClick={handlePublishRecipe}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-indigo-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Publish Recipe
          </motion.button>
        </motion.div>
      )}

      {error && (
        <motion.p
          className="text-red-500 mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default UserGenerateRecipeForm;