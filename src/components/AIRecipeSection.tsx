"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const AIRecipeSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">Create Your Own Recipe with AI</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Experience the future of cooking! Generate unique, personalized recipes using our AI-powered tool. It's completely free and requires no sign-up.
        </p>
        <Link href="/generate-recipe">
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold cursor-pointer transition-colors duration-300 hover:bg-gray-100"
          >
            Create Your Recipe Now
          </motion.span>
        </Link>
      </div>
    </motion.section>
  );
};

export default AIRecipeSection;
