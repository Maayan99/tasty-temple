"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
  'Top 5 Air Fryer Recipes',
  'Quick and Easy Weeknight Dinners',
  'Healthy Breakfast Ideas',
  'Delicious Vegan Desserts',
  'Meal Prep Tips for Busy Professionals'
];

const AnimatedBanner: React.FC = () => {
  const [currentTip, setCurrentTip] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white text-2xl font-bold text-center"
            >
              {tips[currentTip]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBanner;
