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
        staggerChildren: 0.1
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
      className="mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
      <ol className="list-decimal list-inside space-y-4">
        {instructionSteps.map((step, index) => (
          <motion.li key={index} variants={itemVariants} className="pl-4">
            {step}
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
};

export default InstructionList;
