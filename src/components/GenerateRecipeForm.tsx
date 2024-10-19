"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GenerateRecipeForm: React.FC = () => {
  const [direction, setDirection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationLog, setGenerationLog] = useState<string[]>([]);
  const [isBulkGeneration, setIsBulkGeneration] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGenerationLog([]);

    try {
      const directions = isBulkGeneration ? direction.split('\n').filter(d => d.trim() !== '') : [direction];

      const generatePromises = directions.map(async (dir) => {
        const response = await fetch('/api/generate-recipes/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction: dir }),
        });

        if (!response.ok) {
          throw new Error(`Failed to start recipe generation for: ${dir}`);
        }

        return response.json();
      });

      const results = await Promise.all(generatePromises);
      setGenerationLog(results.flatMap(r => r.recipeIdeas.map((idea: any) => `Generated idea: ${idea.title}`)));
    } catch (err) {
      setError('Error starting recipe generation. Please try again.');
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
            {isLoading ? 'Starting Generation...' : 'Generate Recipes'}
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
