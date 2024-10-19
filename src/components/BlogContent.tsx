"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogImage } from '@/types/recipe';

interface BlogContentProps {
  content: string;
  images: BlogImage[];
}

// Function to apply bold formatting
const applyFormatting = (text: string) => {
  // Replace *bold* with <strong>bold</strong>
  return text.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
};

const BlogContent: React.FC<BlogContentProps> = ({ content, images }) => {
  const contentWithImages = content.split(/\\n|\n/).map((paragraph, index) => {
    if (paragraph.startsWith('# ')) {
      return { type: 'title', content: paragraph.slice(2) };
    }
    if (paragraph.startsWith('### ')) {
      return { type: 'subtitle', level: 3, content: paragraph.slice(4) };
    }
    if (paragraph.startsWith('## ')) {
      return { type: 'subtitle', level: 2, content: paragraph.slice(3) };
    }
    if (paragraph.startsWith('# ')) {
      return { type: 'subtitle', level: 1, content: paragraph.slice(2) };
    }
    if (paragraph.match(/^<<IMAGE \d+>>$/)) {
      const imageIndex = parseInt(paragraph.match(/\d+/)![0]) - 1;
      return { type: 'image', image: images[imageIndex] };
    }
    return { type: 'paragraph', content: applyFormatting(paragraph) };
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
          } else if (item.type === 'subtitle') {
            const Tag = `h${(item.level || 2) + 2}` as keyof JSX.IntrinsicElements;
            const MotionTag = motion(Tag) || ""; // Dynamically create the motion component
            return (
              <MotionTag
                key={index}
                className="text-xl text-black font-semibold mt-4 mb-3 text-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                dangerouslySetInnerHTML={{ __html: item.content || "" }}
              />
            );
          } else if (item.type === 'paragraph') {
            return (
              <motion.p
                key={index}
                className="mb-4 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
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
