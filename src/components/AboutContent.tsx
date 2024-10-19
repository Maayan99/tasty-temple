"use client";

import React from 'react';
import Image from 'next/image';
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
              Our Story
            </motion.h2>
            <motion.p
              className="mt-4 text-xl text-gray-600"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Tasty Temple was born out of a passion for culinary exploration and a desire to share the joy of cooking with food enthusiasts around the world. Our journey began in a small kitchen, experimenting with flavors and techniques from diverse cuisines.
            </motion.p>
            <motion.p
              className="mt-4 text-xl text-gray-600"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Today, we've grown into a vibrant community of food lovers, chefs, and home cooks, all united by our love for delicious, inspiring recipes. Our mission is to make cooking accessible, enjoyable, and exciting for everyone, from novice cooks to seasoned chefs.
            </motion.p>
          </div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Image
              src="/about-image.jpg"
              alt="Tasty Temple Team"
              width={600}
              height={400}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <h3 className="text-3xl font-bold text-gray-900">Our Values</h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Quality', description: 'We believe in using the finest ingredients and techniques to create exceptional dishes.' },
              { title: 'Creativity', description: 'We encourage culinary innovation and unique flavor combinations.' },
              { title: 'Community', description: 'We foster a supportive environment for food lovers to share and learn.' },
              { title: 'Sustainability', description: 'We promote eco-friendly cooking practices and responsible sourcing.' },
              { title: 'Diversity', description: 'We celebrate the rich tapestry of global cuisines and culinary traditions.' },
              { title: 'Education', description: 'We're committed to helping our community develop their culinary skills.' },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-gray-50 p-6 rounded-lg shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
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
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Our Culinary Adventure</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a seasoned chef or just starting your culinary journey, Tasty Temple is here to inspire, educate, and celebrate the art of cooking. Join us in exploring the wonderful world of flavors, techniques, and culinary creativity!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutContent;
