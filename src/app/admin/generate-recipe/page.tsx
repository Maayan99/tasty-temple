"use client"

import React from 'react';
import GenerateRecipeForm from '@/components/GenerateRecipeForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

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
    <AdminLayout>
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Generate Recipe</h1>
        <GenerateRecipeForm />
      </div>
    </AdminLayout>
  );
}
