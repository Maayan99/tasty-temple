"use client";

import React from 'react';
import { motion } from 'framer-motion';

const AboutContent: React.FC = () => {
  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="lg:grid lg:grid-cols-2 lg:gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 lg:mb-0">
            <motion.h2
              className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Revolutionizing Recipe Creation with AI
            </motion.h2>
            <motion.p
              className="mt-4 text-xl text-gray-600"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              At Tasty Temple, we're on a mission to make culinary creativity accessible to everyone. Our AI-powered platform empowers food enthusiasts to craft personalized recipes, bringing their unique culinary visions to life.
            </motion.p>
            <motion.p
              className="mt-4 text-xl text-gray-600"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              We believe in the power of AI to inspire and assist, not replace human creativity. That's why we've designed our platform to allow users to intervene at every step of the recipe creation process, ensuring that each dish is a true reflection of their tastes and preferences.
            </motion.p>
          </div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <svg
              className="w-full h-auto"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="80" fill="#4F46E5" />
              <path
                d="M100 20
                   A80 80 0 0 1 180 100
                   A80 80 0 0 1 100 180
                   A80 80 0 0 1 20 100"
                fill="none"
                stroke="#FFF"
                strokeWidth="4"
              />
              <path
                d="M100 40
                   A60 60 0 0 1 160 100
                   A60 60 0 0 1 100 160
                   A60 60 0 0 1 40 100"
                fill="none"
                stroke="#FFF"
                strokeWidth="4"
              />
              <circle cx="100" cy="100" r="10" fill="#FFF" />
              <circle cx="140" cy="60" r="5" fill="#FFF" />
              <circle cx="60" cy="140" r="5" fill="#FFF" />
              <circle cx="140" cy="140" r="5" fill="#FFF" />
              <circle cx="60" cy="60" r="5" fill="#FFF" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-3xl font-bold text-gray-900">Our AI-Powered Features</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Custom Recipe Generation', description: 'Create unique recipes tailored to your preferences and dietary needs.' },
              { title: 'Step-by-Step Customization', description: 'Intervene at any point in the recipe creation process to add your personal touch.' },
              { title: 'Ingredient Substitution', description: 'Easily swap ingredients based on availability or dietary restrictions.' },
              { title: 'Scaling and Conversion', description: 'Automatically adjust serving sizes and convert between measurement units.' },
              { title: 'Recipe Sharing', description: 'Share your culinary creations with the Tasty Temple community.' },
              { title: 'Continuous Learning', description: 'Our AI improves with each recipe, offering increasingly personalized suggestions.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-50 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our AI-Powered Culinary Revolution</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a seasoned chef or a cooking novice, Tasty Temple's AI-powered platform is here to inspire, assist, and elevate your culinary journey. Join us in exploring the exciting intersection of artificial intelligence and gastronomy!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutContent;
