"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RecipeIdea {
  title: string;
  description: string;
}

interface GeneratedRecipe {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string[];
  nutrition: { [key: string]: number };
  imagePrompt: string;
  imageAltText: string;
  blogSummary: string;
  blogImagePrompts: { prompt: string; altText: string }[];
  blogContent: string;
}

const GenerateRecipeForm: React.FC = () => {
  const [direction, setDirection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [isBulkGeneration, setIsBulkGeneration] = useState(false);
  const [recipeIdeas, setRecipeIdeas] = useState<RecipeIdea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<number[]>([]);
  const [generatedRecipes, setGeneratedRecipes] = useState<GeneratedRecipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [timer, setTimer] = useState(8);
  const [currentStep, setCurrentStep] = useState(0);
  const [backloggedDirections, setBackloggedDirections] = useState<string[]>([]);
  const [isProcessingBacklog, setIsProcessingBacklog] = useState(false);
  const [currentDirection, setCurrentDirection] = useState('');
  const [currentStepDescription, setCurrentStepDescription] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0 && currentStep > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      handleAutoProgress();
    }
    return () => clearInterval(interval);
  }, [timer, currentStep]);

  useEffect(() => {
    if (isProcessingBacklog && backloggedDirections.length > 0) {
      processNextBackloggedDirection();
    }
  }, [isProcessingBacklog, backloggedDirections]);

  const handleAutoProgress = () => {
    if (currentStep === 1) {
      handleGenerateFullRecipes();
    } else if (currentStep === 2) {
      handlePublishRecipes();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGenerationLog([]);
    setRecipeIdeas([]);

    try {
      const directions = isBulkGeneration ? direction.split('\n').filter(d => d.trim() !== '') : [direction];

      if (isBulkGeneration) {
        setBackloggedDirections(directions);
        setIsProcessingBacklog(true);
        setGenerationLog([...generationLog, `Added ${directions.length} directions to the backlog`]);
      } else {
        await processDirection(directions[0]);
      }
    } catch (err) {
      setError('Error processing directions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const processNextBackloggedDirection = async () => {
    if (backloggedDirections.length > 0) {
      const nextDirection = backloggedDirections[0];
      setCurrentDirection(nextDirection);
      setCurrentStepDescription('Generating recipe ideas');
      await processDirection(nextDirection);
      setBackloggedDirections(backloggedDirections.slice(1));
    } else {
      setIsProcessingBacklog(false);
      setGenerationLog([...generationLog, 'All backlogged directions processed']);
      setCurrentDirection('');
      setCurrentStepDescription('');
    }
  };

  const processDirection = async (dir: string) => {
    try {
      const response = await fetch('/api/generate-recipes/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction: dir }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate recipe ideas for: ${dir}`);
      }

      const result = await response.json();
      setRecipeIdeas(result.recipeIdeas);
      setSelectedIdeas(result.recipeIdeas.map((_: any, index: number) => index));
      setGenerationLog([...generationLog, `Generated ideas for: ${dir}`]);
      setCurrentStep(1);
      setTimer(8);
      setCurrentStepDescription('Selecting recipe ideas');
    } catch (err) {
      setError(`Error generating recipe ideas for: ${dir}. Please try again.`);
    }
  };

  const generateDirections = async () => {
    try {
      const response = await fetch('/api/generate-recipes/directions', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate directions');
      }

      const data = await response.json();
      setDirection(data.directions.join('\n'));
    } catch (err) {
      setError('Error generating directions. Please try again.');
    }
  };

  const handleIdeaSelection = (index: number) => {
    setSelectedIdeas(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleGenerateFullRecipes = async () => {
    setIsLoading(true);
    setError('');
    setGenerationLog([...generationLog, 'Generating full recipes']);
    setCurrentStepDescription('Generating full recipes');

    try {
      const selectedRecipeIdeas = recipeIdeas.filter((_, index) => selectedIdeas.includes(index));

      const response = await fetch('/api/generate-recipes/generate-full-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeIdeas: selectedRecipeIdeas }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate full recipes');
      }

      const result = await response.json();
      setGeneratedRecipes(result.generatedRecipes);
      setSelectedRecipes(result.generatedRecipes.map((_: any, index: number) => index));
      setGenerationLog([...generationLog, 'Full recipes generated']);
      setCurrentStep(2);
      setTimer(8);
      setCurrentStepDescription('Selecting recipes to publish');
    } catch (err) {
      setError('Error generating full recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeSelection = (index: number) => {
    setSelectedRecipes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handlePublishRecipes = async () => {
    setIsLoading(true);
    setError('');
    setGenerationLog([...generationLog, 'Publishing recipes']);
    setCurrentStepDescription('Publishing recipes');

    try {
      const selectedRecipesToPublish = generatedRecipes.filter((_, index) => selectedRecipes.includes(index));

      const response = await fetch('/api/generate-recipes/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedRecipes: selectedRecipesToPublish }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish recipes');
      }

      const result = await response.json();
      setGenerationLog([...generationLog, 'Recipes published successfully']);
      // Reset the form after successful publication
      setRecipeIdeas([]);
      setGeneratedRecipes([]);
      setSelectedIdeas([]);
      setSelectedRecipes([]);
      setCurrentStep(0);
      setTimer(8);
      setCurrentStepDescription('');

      if (isProcessingBacklog) {
        processNextBackloggedDirection();
      }
    } catch (err) {
      setError('Error publishing recipes. Please try again.');
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
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bulkGeneration">
            <input
              type="checkbox"
              id="bulkGeneration"
              checked={isBulkGeneration}
              onChange={(e) => setIsBulkGeneration(e.target.checked)}
              className="mr-2"
            />
            Bulk Generation
          </label>
        </div>
        <motion.textarea
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          placeholder={isBulkGeneration ? "Enter multiple directions, one per line..." : "Enter a direction for recipe ideas (optional)..."}
          className="w-full text-black p-4 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={isBulkGeneration ? 8 : 4}
          initial={{ scale: 0.95 }}
          whileFocus={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
        <div className="flex justify-between mb-4">
          <motion.button
            type="button"
            onClick={generateDirections}
            className="bg-green-500 text-white px-4 py-2 rounded-md font-semibold text-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate Directions
          </motion.button>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Processing...' : isBulkGeneration ? 'Add to Backlog' : 'Generate Recipe Ideas'}
          </motion.button>
        </div>
      </form>
      {error && (
        <motion.p
          className="text-red-500 mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-inner mb-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Backlog Status:</h2>
        <p>Backlogged Directions: {backloggedDirections.length}</p>
        <p>Current Direction: {currentDirection || 'None'}</p>
        <p>Current Step: {currentStepDescription || 'None'}</p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Backlogged Directions:</h3>
        <ul className="list-disc pl-5">
          {backloggedDirections.map((dir, index) => (
            <li key={index} className={index === 0 ? 'font-bold' : ''}>{dir}</li>
          ))}
        </ul>
      </motion.div>
      {recipeIdeas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-inner mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Recipe Ideas:</h2>
          <ul className="space-y-4">
            {recipeIdeas.map((idea, index) => (
              <motion.li
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <input
                  type="checkbox"
                  checked={selectedIdeas.includes(index)}
                  onChange={() => handleIdeaSelection(index)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{idea.title}</h3>
                  <p className="text-gray-600">{idea.description}</p>
                </div>
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={handleGenerateFullRecipes}
            disabled={isLoading || selectedIdeas.length === 0}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate Full Recipes for Selected Ideas ({timer}s)
          </motion.button>
        </motion.div>
      )}
      {generatedRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-inner mb-8"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generated Full Recipes:</h2>
          <ul className="space-y-4">
            {generatedRecipes.map((recipe, index) => (
              <motion.li
                key={index}
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <input
                  type="checkbox"
                  checked={selectedRecipes.includes(index)}
                  onChange={() => handleRecipeSelection(index)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
                  <p className="text-gray-600">{recipe.description}</p>
                  <p className="text-sm text-gray-500">{recipe.cookingTime} mins | {recipe.difficulty} | Serves {recipe.servings}</p>
                </div>
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={handlePublishRecipes}
            disabled={isLoading || selectedRecipes.length === 0}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Publish Selected Recipes ({timer}s)
          </motion.button>
        </motion.div>
      )}
      {generationLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-inner"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Generation Log:</h2>
          <ul className="space-y-2">
            {generationLog.map((log, index) => (
              <motion.li
                key={index}
                className="text-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {log}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GenerateRecipeForm;
