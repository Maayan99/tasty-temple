import React from 'react';
import GenerateRecipeForm from '@/components/GenerateRecipeForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function GenerateRecipePage() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');

  if (!authCookie) {
    redirect('/admin/login');
  }

  const [username, password] = Buffer.from(authCookie.value, 'base64').toString().split(':');

  if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
    redirect('/admin/login');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Recipe</h1>
      <GenerateRecipeForm />
    </div>
  );
}
