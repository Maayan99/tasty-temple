"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogImage } from '@/types/recipe';

interface BlogContentProps {
  content: string;
  images: BlogImage[];
}

// Function to format content and return as JSX
const formatContent = (text: string) => {
  const parts = text.split(/([*][^*]+[*]|\n\*\s.+)/g); // Split text by bold markers and list items
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <strong key={index}>{part.slice(1, -1)}</strong>; // Render bold text
    } else if (part.startsWith('\n* ')) {
      return <li key={index}>{part.slice(3)}</li>; // Render list item
    }
    return part; // Render normal text
  });
};

const BlogContent: React.FC<BlogContentProps> = ({ content, images }) => {
  const usedImageIndexes = new Set<number>();

  const contentWithImages = content.split(/\n|\r\n/).map((paragraph, index) => {
    const imagePattern = /<<.*?IMAGE\s*(\d+).*?>>/i;
    const imageMatch = paragraph.match(imagePattern);

    if (imageMatch) {
      const imageIndex = parseInt(imageMatch[1], 10) - 1;
      if (imageIndex >= 0 && imageIndex < images.length) {
        usedImageIndexes.add(imageIndex);
        return { type: 'image', image: images[imageIndex], text: paragraph.replace(imagePattern, '').trim() };
      }
    }

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
    return { type: 'paragraph', content: paragraph };
  });

  const unusedImages = images.filter((_, index) => !usedImageIndexes.has(index));

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
            const Tag = `h${(item.level || 1) + 2}` as keyof JSX.IntrinsicElements;
            const MotionTag = motion(Tag); // Dynamically create the motion component
            return (
              <MotionTag
                key={index}
                className="text-xl text-black font-semibold mt-4 mb-3 text-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {formatContent(item.content || "")}
              </MotionTag>
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
                {formatContent(item.content || "")}
              </motion.p>
            );
          } else if (item.type === 'image' && item.image) {
            return (
              <motion.div
                key={index}
                className="my-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Image
                  src={item.image.imageUrl}
                  alt={item.image.altText}
                  width={800}
                  height={600}
                  layout="responsive"
                  className="rounded-lg shadow-md"
                  unoptimized
                />
                <p className="text-sm text-gray-600 mt-2 text-center">{item.image.altText}</p>
              </motion.div>
            );
          }
        })}
      </div>
      {unusedImages.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Additional Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {unusedImages.map((image, index) => (
              <motion.div
                key={index}
                className="my-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.altText}
                  width={800}
                  height={600}
                  layout="responsive"
                  className="rounded-lg shadow-md"
                  unoptimized
                />
                <p className="text-sm text-gray-600 mt-2 text-center">{image.altText}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BlogContent;
