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
  user: User;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface BlogImage {
  id: number;
  imageUrl: string;
  altText: string;
}
