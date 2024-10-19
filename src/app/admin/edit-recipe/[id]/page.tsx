import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import RecipeEditor from '@/components/RecipeEditor';
import { getRecipeById } from '@/lib/recipes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');

  if (!authCookie) {
    redirect('/admin/login');
  }

  const [username, password] = Buffer.from(authCookie.value, 'base64').toString().split(':');

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login');
  }

  const recipe = await getRecipeById(parseInt(params.id));

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Recipe</h1>
        <RecipeEditor recipe={recipe} />
      </div>
    </AdminLayout>
  );
}
