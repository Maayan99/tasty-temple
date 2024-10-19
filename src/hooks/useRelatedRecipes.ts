import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { getRelatedRecipes } from '@/lib/recipes';

export function useRelatedRecipes(recipeId: number) {
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRelatedRecipes() {
      try {
        const recipes = await getRelatedRecipes(recipeId);
        setRelatedRecipes(recipes);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }

    fetchRelatedRecipes();
  }, [recipeId]);

  return { relatedRecipes, isLoading, error };
}
