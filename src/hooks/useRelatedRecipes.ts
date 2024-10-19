import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { getRelatedRecipes } from '@/lib/recipes';

export function useRelatedRecipes(recipeSlug: string) {
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRelatedRecipes() {
      try {
        setIsLoading(true);
        const recipes = await getRelatedRecipes(recipeSlug, 3);
        setRelatedRecipes(recipes);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }

    fetchRelatedRecipes();
  }, [recipeSlug]);

  return { relatedRecipes, isLoading, error };
}
