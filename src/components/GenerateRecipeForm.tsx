"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const GenerateRecipeForm: React.FC = () => {
  const [direction, setDirection] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generationLog, setGenerationLog] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setGenerationLog([]);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const data = await response.json();
      setGenerationLog(data.log);
    } catch (err) {
      setError('Error generating recipes. Please try again.');
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
        <motion.textarea
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          placeholder="Enter a direction for recipe ideas (optional)..."
          className="w-full p-4 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          {isLoading ? 'Generating...' : 'Generate Recipes'}
        </motion.button>
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
