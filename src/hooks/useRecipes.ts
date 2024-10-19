import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { getLatestRecipes, getTrendingRecipes } from '@/lib/recipes';

type RecipeType = 'latest' | 'trending';

export function useRecipes(limit: number, type: RecipeType) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        let fetchedRecipes: Recipe[];
        if (type === 'latest') {
          fetchedRecipes = await getLatestRecipes(limit);
        } else {
          fetchedRecipes = await getTrendingRecipes(limit);
        }
        setRecipes(fetchedRecipes);
        setIsLoading(false);
      } catch (err) {
        setError(err as Error);
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, [limit, type]);

  return { recipes, isLoading, error };
}
