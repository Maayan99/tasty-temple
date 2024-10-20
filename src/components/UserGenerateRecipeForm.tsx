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
      setProgress(33);
    } catch (err) {
      setError('The server is currently overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFullRecipe = async () => {
    setIsLoading(true);
    setError('');
    setProgress(33);

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
      setProgress(66);
    } catch (err) {
      setError('The server is currently overloaded. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublishRecipe = async () => {
    setIsLoading(true);
    setError('');
    setProgress(66);

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
      className="bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-lg p-8 max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
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
            className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-md mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{recipeIdea.title}</h2>
            <p className="text-gray-600 mb-6">{recipeIdea.description}</p>
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
            className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg shadow-md mb-8"
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
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </span>
              ) : (
                'Publish Recipe'
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
