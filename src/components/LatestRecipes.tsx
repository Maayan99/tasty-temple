"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const latestRecipes = [
  { id: 1, title: 'Vegan Buddha Bowl', image: '/images/vegan-buddha-bowl.jpg', description: 'A nutritious and colorful bowl packed with plant-based goodness.' },
  { id: 2, title: 'Lemon Garlic Shrimp Pasta', image: '/images/shrimp-pasta.jpg', description: 'A light and zesty pasta dish perfect for summer evenings.' },
  { id: 3, title: 'Chocolate Lava Cake', image: '/images/chocolate-lava-cake.jpg', description: 'Indulgent chocolate dessert with a gooey center.' },
  { id: 4, title: 'Crispy Baked Chicken Wings', image: '/images/chicken-wings.jpg', description: 'Perfectly crispy wings without the need for deep frying.' },
  { id: 5, title: 'Quinoa Stuffed Bell Peppers', image: '/images/stuffed-peppers.jpg', description: 'A healthy and satisfying vegetarian main course.' },
  { id: 6, title: 'Homemade Margherita Pizza', image: '/images/margherita-pizza.jpg', description: 'Classic Italian pizza with fresh mozzarella and basil.' },
];

const LatestRecipes: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Recipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/recipe/${recipe.id}`}>
                <div className="relative h-48">
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
                  <p className="text-gray-600">{recipe.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestRecipes;
