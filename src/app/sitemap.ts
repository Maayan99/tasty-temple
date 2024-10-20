import { MetadataRoute } from 'next'
import { getLatestRecipes } from '@/lib/recipes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tastytemple.com'

  // Get all recipes
  const recipes = await getLatestRecipes(1000) // Adjust the number as needed

  const recipeUrls = recipes.map((recipe) => ({
    url: `${baseUrl}/recipe/${recipe.slug}`,
    lastModified: new Date(recipe.updatedAt),
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/generate-recipe`,
      lastModified: new Date(),
    },
    ...recipeUrls,
  ]
}