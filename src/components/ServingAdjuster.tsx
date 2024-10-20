"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ServingAdjusterProps {
  servings: number;
  setServings: (servings: number) => void;
}

const ServingAdjuster: React.FC<ServingAdjusterProps> = ({ servings, setServings }) => {
  return (
    <motion.div
      className="flex items-center gap-4 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
    >
      <span className="text-black text-lg font-semibold">Servings:</span>
      <button
        className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
        onClick={() => setServings(Math.max(1, servings - 1))}
      >
        -
      </button>
      <span className="text-black text-xl font-bold">{servings}</span>
      <button
        className="bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center"
        onClick={() => setServings(servings + 1)}
      >
        +
      </button>
    </motion.div>
  );
};

export default ServingAdjuster;
