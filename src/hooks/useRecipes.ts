import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';

type RecipeType = 'latest' | 'featured' | 'search' | 'trending';

export function useRecipes(limit: number, type: RecipeType, searchTerm?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        let url = '';
        if (type === 'latest') {
          url = `/api/recipes/latest?limit=${limit}`;
        } else if (type === 'featured' || type === 'trending') {
          url = `/api/recipes/featured?limit=${limit}`;
        } else if (type === 'search' && searchTerm) {
          url = `/api/recipes/search?term=${encodeURIComponent(searchTerm)}&limit=${limit}`;
        } else {
          throw new Error('Invalid recipe type');
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const fetchedRecipes = await response.json();
        setRecipes(fetchedRecipes);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, [limit, type, searchTerm]);

  const deleteRecipe = async (id: number) => {
    try {
      const response = await fetch(`/api/recipes/delete?id=${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete recipe'));
    }
  };

  return { recipes, isLoading, error, deleteRecipe };
}
