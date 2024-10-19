"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const RecipeFilter: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegetarian', 'Gluten-Free'];

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {filters.map((filter) => (
        <motion.button
          key={filter}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${activeFilter === filter ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setActiveFilter(filter)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filter}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default RecipeFilter;