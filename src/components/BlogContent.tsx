"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogImage } from '@/types/recipe';

interface BlogContentProps {
  content: string;
  images: BlogImage[];
}

const BlogContent: React.FC<BlogContentProps> = ({ content, images }) => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recipe Blog</h2>
      <div className="prose prose-lg max-w-none mb-8">
        {content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="mb-4">{paragraph}</p>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="relative h-64 rounded-lg overflow-hidden shadow-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Image
              src={image.imageUrl}
              alt={image.altText}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
              unoptimized
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BlogContent;
