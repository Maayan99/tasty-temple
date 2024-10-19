"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useComments } from '@/hooks/useComments';

interface CommentSectionProps {
  recipeId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ recipeId }) => {
  const { comments, addComment, isLoading, error } = useComments(recipeId);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (error) return <div>Error loading comments</div>;

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          className="w-full p-2 border rounded-md"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Post Comment
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            className="bg-gray-50 p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="mb-2">{comment.content}</p>
            <p className="text-sm text-gray-500">By {comment.user.name} on {new Date(comment.createdAt).toLocaleDateString()}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CommentSection;
