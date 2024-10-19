"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className="bg-white shadow-md"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">Tasty Temple</Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-indigo-600 transition duration-300">Home</Link>
          <Link href="/recipes" className="text-gray-700 hover:text-indigo-600 transition duration-300">Recipes</Link>
          <Link href="/categories" className="text-gray-700 hover:text-indigo-600 transition duration-300">Categories</Link>
          <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition duration-300">About</Link>
        </nav>
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <motion.div
          className="md:hidden bg-white py-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">Home</Link>
          <Link href="/recipes" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">Recipes</Link>
          <Link href="/categories" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">Categories</Link>
          <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-indigo-100">About</Link>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
