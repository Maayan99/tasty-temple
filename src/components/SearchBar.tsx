"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/recipes?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <motion.div
      className="py-8 bg-gray-100"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default SearchBar;
