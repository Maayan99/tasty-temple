"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface InstructionListProps {
  instructions: string;
}

const InstructionList: React.FC<InstructionListProps> = ({ instructions }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const instructionSteps = instructions.split('\n').filter(step => step.trim() !== '');

  return (
    <motion.div
      className="mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Instructions</h2>
      <ol className="space-y-6 bg-white p-6 rounded-2xl shadow-md">
        {instructionSteps.map((step, index) => (
          <motion.li key={index} variants={itemVariants} className="flex">
            <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1 font-semibold">{index + 1}</span>
            <p className="text-gray-700 leading-relaxed">{step}</p>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
};

export default InstructionList;
