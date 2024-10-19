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
    if (currentStep > 0) {
      setTimer(8); // Reset the timer when currentStep changes
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            handleAutoProgress();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep]);

  useEffect(() => {
    if (isProcessingBacklog && backloggedDirections.length > 0 && !isLoading) {
      processNextBackloggedDirection();
    }
  }, [isProcessingBacklog, backloggedDirections, isLoading]);

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
      const directions = isBulkGeneration
        ? direction.split('\n').filter((d) => d.trim() !== '')
        : [direction];

      if (isBulkGeneration) {
        setBackloggedDirections(directions);
        setIsProcessingBacklog(true);
        setGenerationLog((prevLog) => [
          ...prevLog,
          `Added ${directions.length} directions to the backlog`,
        ]);
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
    if (backloggedDirections.length > 0 && !isLoading) {
      const nextDirection = backloggedDirections[0];
      setCurrentDirection(nextDirection);
      setCurrentStepDescription('Generating recipe ideas');
      await processDirection(nextDirection);
    } else {
      setIsProcessingBacklog(false);
      setGenerationLog((prevLog) => [...prevLog, 'All backlogged directions processed']);
      setCurrentDirection('');
      setCurrentStepDescription('');
    }
  };

  const processDirection = async (dir: string) => {
    setIsLoading(true);
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
      setGenerationLog((prevLog) => [...prevLog, `Generated ideas for: ${dir}`]);
      setCurrentStep(1);
      setCurrentStepDescription('Selecting recipe ideas');
    } catch (err) {
      setError(`Error generating recipe ideas for: ${dir}. Please try again.`);
      // Proceed to next direction on error
      if (isProcessingBacklog) {
        setBackloggedDirections((prev) => prev.slice(1));
      }
    } finally {
      setIsLoading(false);
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
    setSelectedIdeas((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleGenerateFullRecipes = async () => {
    setIsLoading(true);
    setError('');
    setGenerationLog((prevLog) => [...prevLog, 'Generating full recipes']);
    setCurrentStepDescription('Generating full recipes');

    try {
      const selectedRecipeIdeas = recipeIdeas.filter((_, index) =>
        selectedIdeas.includes(index)
      );

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
      setGenerationLog((prevLog) => [...prevLog, 'Full recipes generated']);
      setCurrentStep(2);
      setCurrentStepDescription('Selecting recipes to publish');
    } catch (err) {
      setError('Error generating full recipes. Please try again.');
      // Proceed to next direction on error
      if (isProcessingBacklog) {
        setBackloggedDirections((prev) => prev.slice(1));
        setCurrentStep(0);
        setCurrentStepDescription('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeSelection = (index: number) => {
    setSelectedRecipes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handlePublishRecipes = async () => {
    setIsLoading(true);
    setError('');
    setGenerationLog((prevLog) => [...prevLog, 'Publishing recipes']);
    setCurrentStepDescription('Publishing recipes');

    try {
      const selectedRecipesToPublish = generatedRecipes.filter((_, index) =>
        selectedRecipes.includes(index)
      );

      const response = await fetch('/api/generate-recipes/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generatedRecipes: selectedRecipesToPublish }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish recipes');
      }

      const result = await response.json();
      setGenerationLog((prevLog) => [...prevLog, 'Recipes published successfully']);
      // Reset the form after successful publication
      setRecipeIdeas([]);
      setGeneratedRecipes([]);
      setSelectedIdeas([]);
      setSelectedRecipes([]);
      setCurrentStep(0);
      setCurrentStepDescription('');

      if (isProcessingBacklog) {
        setBackloggedDirections((prev) => prev.slice(1));
        // Let useEffect handle the next direction
      }
    } catch (err) {
      setError('Error publishing recipes. Please try again.');
      // Proceed to next direction on error
      if (isProcessingBacklog) {
        setBackloggedDirections((prev) => prev.slice(1));
        setCurrentStep(0);
        setCurrentStepDescription('');
      }
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
      {/* ...rest of your component JSX remains unchanged... */}
    </motion.div>
  );
};

export default GenerateRecipeForm;
