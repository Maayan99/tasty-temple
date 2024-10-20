"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UserGenerateRecipeForm: React.FC = () => {
  const [direction, setDirection] = useState('');
  const [recipeIdea, setRecipeIdea] = useState<{ title: string; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fullRecipe, setFullRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const steps = [
    { number: 1, name: 'Idea Generation' },
    { number: 2, name: 'Recipe Refinement' },
    { number: 3, name: 'Full Recipe Creation' },
    { number: 4, name: 'Image Generation and Finalization' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRecipeIdea(null);
    setProgress(0);

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
      setCurrentStep(2);
      setProgress(25);
    } catch (err) {
      setError('The server is currently overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRecipeIdea = (field: 'title' | 'description', value: string) => {
    if (recipeIdea) {
      setRecipeIdea({ ...recipeIdea, [field]: value });
    }
  };

  const handleGenerateFullRecipe = async () => {
    setIsLoading(true);
    setError('');
    setProgress(50);

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
      setCurrentStep(3);
      setProgress(75);
    } catch (err) {
      setError('The server is currently overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFullRecipe = (field: string, value: any) => {
    setFullRecipe((prevRecipe: any) => ({
      ...prevRecipe,
      [field]: value,
    }));
  };

  const handleEditIngredient = (index: number, field: string, value: string) => {
    setFullRecipe((prevRecipe: any) => ({
      ...prevRecipe,
      ingredients: prevRecipe.ingredients.map((ingredient: any, i: number) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      ),
    }));
  };

  const handleEditInstruction = (index: number, value: string) => {
    setFullRecipe((prevRecipe: any) => ({
      ...prevRecipe,
      instructions: prevRecipe.instructions.map((instruction: string, i: number) =>
        i === index ? value : instruction
      ),
    }));
  };

  const handleEditImagePrompt = (index: number, field: string, value: string) => {
    setFullRecipe((prevRecipe: any) => ({
      ...prevRecipe,
      blogImagePrompts: prevRecipe.blogImagePrompts.map((prompt: any, i: number) =>
        i === index ? { ...prompt, [field]: value } : prompt
      ),
    }));
  };

  const handleGenerateImagesAndFinalize = async () => {
    setIsLoading(true);
    setError('');
    setProgress(90);

    try {
      const response = await fetch('/api/generate-recipes/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedRecipes: [fullRecipe] }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate images and finalize recipe');
      }

      const data = await response.json();
      const publishedRecipe = data.publishedRecipes[0];
      setProgress(100);
      router.push(`/recipe/${publishedRecipe.slug}`);
    } catch (err) {
      setError('The server is currently overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-lg p-4 sm:p-8 max-w-2xl mx-auto relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      <div className="mb-8 flex justify-between items-center overflow-x-auto py-2">
        {steps.map((step) => (
          <motion.div
            key={step.number}
            className={`flex flex-col items-center justify-center px-2 ${
              currentStep >= step.number
                ? 'text-indigo-600'
                : 'text-gray-400'
            }`}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: currentStep >= step.number ? 1 : 0.8,
              opacity: currentStep >= step.number ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mb-1 ${
                currentStep >= step.number
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.number}
            </div>
            <span className="text-xs text-center">{step.name}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.form
            key="direction-form"
            onSubmit={handleSubmit}
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <motion.textarea
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              placeholder="Enter a direction for your recipe idea..."
              className="w-full text-black p-4 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-inner"
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
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Recipe Idea'
              )}
            </motion.button>
          </motion.form>
        )}

        {currentStep === 2 && recipeIdea && (
          <motion.div
            key="recipe-idea"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Recipe Idea</h2>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="title"
                value={recipeIdea.title}
                onChange={(e) => handleEditRecipeIdea('title', e.target.value)}
                className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                value={recipeIdea.description}
                onChange={(e) => handleEditRecipeIdea('description', e.target.value)}
                className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex justify-between">
              <motion.button
                onClick={() => {
                  setCurrentStep(1);
                  setProgress(0);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Go Back
              </motion.button>
              <motion.button
                onClick={handleGenerateFullRecipe}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:from-green-500 hover:to-blue-600 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Full Recipe'
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && fullRecipe && (
          <motion.div
            key="full-recipe"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Full Recipe</h2>
            
            <div className="mb-4">
              <label htmlFor="fullTitle" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                id="fullTitle"
                value={fullRecipe.title}
                onChange={(e) => handleEditFullRecipe('title', e.target.value)}
                className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="fullDescription"
                value={fullRecipe.description}
                onChange={(e) => handleEditFullRecipe('description', e.target.value)}
                className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Ingredients:</h3>
              {fullRecipe.ingredients.map((ingredient: any, index: number) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={ingredient.quantity}
                    onChange={(e) => handleEditIngredient(index, 'quantity', e.target.value)}
                    className="w-20 text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                  />
                  <input
                    type="text"
                    value={ingredient.unit}
                    onChange={(e) => handleEditIngredient(index, 'unit', e.target.value)}
                    className="w-20 text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                  />
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => handleEditIngredient(index, 'name', e.target.value)}
                    className="flex-grow text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Instructions:</h3>
              {fullRecipe.instructions.map((instruction: string, index: number) => (
                <div key={index} className="mb-2">
                  <textarea
                    value={instruction}
                    onChange={(e) => handleEditInstruction(index, e.target.value)}
                    className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-700">Image Prompts:</h3>
              <div className="mb-2">
                <label htmlFor="mainImagePrompt" className="block text-sm font-medium text-gray-700 mb-1">Main Image Prompt</label>
                <textarea
                  id="mainImagePrompt"
                  value={fullRecipe.imagePrompt}
                  onChange={(e) => handleEditFullRecipe('imagePrompt', e.target.value)}
                  className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              {fullRecipe.blogImagePrompts.map((prompt: any, index: number) => (
                <div key={index} className="mb-2">
                  <label htmlFor={`blogImagePrompt${index}`} className="block text-sm font-medium text-gray-700 mb-1">Blog Image Prompt {index + 1}</label>
                  <textarea
                    id={`blogImagePrompt${index}`}
                    value={prompt.prompt}
                    onChange={(e) => handleEditImagePrompt(index, 'prompt', e.target.value)}
                    className="w-full text-black p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleGenerateImagesAndFinalize}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Images and Finalizing...
                </span>
              ) : (
                'Generate Images and Finalize'
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

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
