import { useState, useEffect } from 'react';
import { Comment } from '@/types/recipe';

export function useComments(recipeId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${recipeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
      setIsLoading(false);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  const addComment = async (content: string, username: string) => {
    try {
      const response = await fetch(`/api/comments/${recipeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const newComment = await response.json();
      setComments([newComment, ...comments]);
      return null; // No error
    } catch (err) {
      return (err as Error).message; // Return error message
    }
  };

  return { comments, addComment, isLoading, error };
}
