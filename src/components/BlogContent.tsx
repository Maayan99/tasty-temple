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
  const contentWithImages = content.split('\\n').map((paragraph, index) => {
    if (paragraph.startsWith('# ')) {
      console.log("Found title: ", paragraph.slice(2))
      return { type: 'title', content: paragraph.slice(2) };
    }
    if (paragraph.match(/^<<IMAGE \d+>>$/)) {
      const imageIndex = parseInt(paragraph.match(/\d+/)![0]) - 1;
      console.log("Found image")
      return { type: 'image', image: images[imageIndex] };
    }
    console.log("Found paragraph: ", paragraph)
    return { type: 'paragraph', content: paragraph };
  });

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Recipe Blog</h2>
      <div className="prose prose-lg max-w-none mb-8">
        {contentWithImages.map((item, index) => {
          if (item.type === 'title') {
            return (
              <motion.h3
                key={index}
                className="text-2xl text-black font-semibold mt-6 mb-4 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {item.content}
              </motion.h3>
            );
          } else if (item.type === 'paragraph') {
            return (
              <motion.p
                key={index}
                className="mb-4 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {item.content}
              </motion.p>
            );
          } else if (item.type === 'image') {
            return (
              <motion.div
                key={index}
                className="my-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Image
                  src={item.image?.imageUrl || ""}
                  alt={item.image?.altText || ""}
                  width={800}
                  height={600}
                  layout="responsive"
                  className="rounded-lg shadow-md"
                  unoptimized
                />
                <p className="text-sm text-gray-600 mt-2 text-center">{item.image?.altText}</p>
              </motion.div>
            );
          }
        })}
      </div>
    </motion.div>
  );
};

export default BlogContent;
