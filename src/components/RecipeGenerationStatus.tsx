"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const RecipeGenerationStatus: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      const response = await fetch('/api/recipe-generation-status');
      const data = await response.json();
      if (data.status !== status) {
        setStatus(data.status);
        setShowNotification(true);
      }
    };

    const interval = setInterval(checkStatus, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [status]);

  const handleReview = () => {
    router.push('/admin/generate-recipe');
  };

  const handleContinue = () => {
    setShowNotification(false);
  };

  if (!status) return null;

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-16 left-0 right-0 bg-indigo-600 text-white p-4 shadow-md z-50"
        >
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-lg">Recipe Generation: {status}</p>
            <div>
              <button
                onClick={handleReview}
                className="mr-4 bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition duration-300"
              >
                Review
              </button>
              <button
                onClick={handleContinue}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400 transition duration-300"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RecipeGenerationStatus;
