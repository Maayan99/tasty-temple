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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
          placeholder="Enter a direction for recipe ideas (optional)..."
          className="w-full p-2 border rounded-md mb-2"
          rows={4}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          {isLoading ? 'Generating...' : 'Generate Recipes'}
        </button>
      </form>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {generationLog.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 p-4 rounded-md"
        >
          <h2 className="text-xl font-semibold mb-2">Generation Log:</h2>
          <ul className="list-disc pl-5">
            {generationLog.map((log, index) => (
              <li key={index}>{log}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GenerateRecipeForm;
