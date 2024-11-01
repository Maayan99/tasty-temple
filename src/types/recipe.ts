export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  imageUrl: string;
  instructions: string;
  nutrition: Record<string, number>;
  ingredients: RecipeIngredient[];
  categories: RecipeCategory[];
  blogContent: string;
  blogImages: BlogImage[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: number;
  quantity: number;
  ingredient: Ingredient;
}

export interface Ingredient {
  id: number;
  name: string;
  unit: string;
}

export interface RecipeCategory {
  id: number;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  slug: string;
  recipeCount: number;
}

export interface Comment {
  id: number;
  content: string;
  user: string;
  createdAt: string | Date;
}

export interface BlogImage {
  id: number;
  imageUrl: string;
  altText: string;
}

export interface GeneratedRecipe {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  servings: number;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string[];
  nutrition: { [key: string]: number };
  imagePrompt: string;
  imageAltText: string;
  blogContent: string;
  blogImagePrompts: { prompt: string; altText: string }[];
}
