"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  recipeId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ recipeId }) => {
  const { comments, addComment, isLoading, error } = useComments(recipeId);
  const [newComment, setNewComment] = useState('');
  const [username, setUsername] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && username.trim()) {
      const error = await addComment(newComment, username);
      if (error) {
        setCommentError(error);
      } else {
        setNewComment('');
        setCommentError(null);
      }
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.3 }}
    >
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-10">
        <input
          type="text"
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300 mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          required
        />
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-300"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        {commentError && (
          <p className="text-red-500 mt-2">{commentError}</p>
        )}
        <motion.button
          type="submit"
          className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Post Comment
        </motion.button>
      </form>
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="text-gray-800 mb-4">{comment.content}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{comment.user}</span>
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default CommentSection;
