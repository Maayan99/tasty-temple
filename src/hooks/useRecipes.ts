import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { getLatestRecipes, getTrendingRecipes, deleteRecipeById } from '@/lib/recipes';

type RecipeType = 'latest' | 'trending';

export function useRecipes(limit: number, type: RecipeType) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        let fetchedRecipes: Recipe[];
        if (type === 'latest') {
          fetchedRecipes = await getLatestRecipes(limit);
        } else {
          fetchedRecipes = await getTrendingRecipes(limit);
        }
        setRecipes(fetchedRecipes);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, [limit, type]);

  const deleteRecipe = async (id: number) => {
    try {
      await deleteRecipeById(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete recipe'));
    }
  };

  return { recipes, isLoading, error, deleteRecipe };
}
