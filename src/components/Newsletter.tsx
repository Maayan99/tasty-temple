"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Subscribed with email:', email);
    setEmail('');
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-white rounded-lg shadow-xl p-8 md:p-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Subscribe to Our Newsletter</h2>
          <p className="text-center text-gray-600 mb-8">Get the latest recipes and cooking tips delivered straight to your inbox!</p>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <motion.button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
