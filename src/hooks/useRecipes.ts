import { useState, useEffect } from 'react';
import { Recipe } from '@/types/recipe';
import { getLatestRecipes, getFeaturedRecipes, deleteRecipeById, searchRecipes } from '@/lib/recipes';

type RecipeType = 'latest' | 'featured' | 'search' | 'trending';

export function useRecipes(limit: number, type: RecipeType, searchTerm?: string) {
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
        } else if (type === 'featured') {
          fetchedRecipes = await getFeaturedRecipes(limit);
        } else if (type === 'search' && searchTerm) {
          fetchedRecipes = await searchRecipes(searchTerm, limit);
        } else {
          throw new Error('Invalid recipe type or missing search term');
        }
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
      await deleteRecipeById(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete recipe'));
    }
  };

  return { recipes, isLoading, error, deleteRecipe };
}
