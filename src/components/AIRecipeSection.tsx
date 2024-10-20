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
      className="py-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-4xl font-bold mb-6">Create Your Own Recipe with AI</h2>
          <p className="text-xl mb-8 max-w-lg">
            Experience the future of cooking! Generate unique, personalized recipes using our AI-powered tool. It's completely free and requires no sign-up.
          </p>
          <Link href="/generate-recipe">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-opacity-90 group"
            >
              <svg className="w-6 h-6 mr-2 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Create Your Recipe Now
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              />
            </motion.span>
          </Link>
        </div>
        <motion.div
          className="md:w-1/2 relative"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <svg className="w-full h-auto" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M47.1,-57.4C59.9,-47.1,68.5,-31.6,71.4,-15.1C74.3,1.4,71.4,18.9,63.3,33.2C55.2,47.5,41.9,58.6,26.8,64.8C11.7,71,-5.2,72.3,-20.6,67.6C-36,62.9,-49.9,52.3,-60.1,38.5C-70.3,24.7,-76.8,7.8,-74.3,-7.9C-71.8,-23.5,-60.4,-37.8,-47,-49.6C-33.6,-61.4,-18.3,-70.6,-1.2,-69.2C15.9,-67.8,34.3,-67.7,47.1,-57.4Z" transform="translate(100 100)" />
          </svg>
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AIRecipeSection;
