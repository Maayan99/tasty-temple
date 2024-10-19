"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Logo from './Logo';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      className="bg-white shadow-md sticky top-0 z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
            <span className="text-2xl font-bold text-indigo-600">Tasty Temple</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar />
            <nav className="flex space-x-6">
              {['Home', 'Recipes', 'Categories', 'About'].map((item) => (
                <Link
                  key={item}
                  href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-indigo-600 transition duration-300 relative group"
                >
                  {item}
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              ))}
            </nav>
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <motion.div
          className="md:hidden bg-white py-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SearchBar />
          {['Home', 'Recipes', 'Categories', 'About'].map((item) => (
            <Link
              key={item}
              href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="block px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;