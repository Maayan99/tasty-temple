import { useState, useEffect } from 'react';
import { Comment } from '@/types/recipe';

// This is a mock implementation. Replace with actual API calls in a real application.
const mockComments: Comment[] = [
  {
    id: 1,
    content: 'Great recipe! I loved it.',
    user: { id: 1, name: 'John Doe', email: 'john@example.com' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    content: 'I made this for dinner and it was delicious!',
    user: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: new Date().toISOString(),
  },
];

export function useComments(recipeId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments(mockComments);
      setIsLoading(false);
    }, 1000);
  }, [recipeId]);

  const addComment = (content: string) => {
    const newComment: Comment = {
      id: comments.length + 1,
      content,
      user: { id: 3, name: 'Current User', email: 'user@example.com' },
      createdAt: new Date().toISOString(),
    };
    setComments([newComment, ...comments]);
  };

  return { comments, addComment, isLoading, error };
}