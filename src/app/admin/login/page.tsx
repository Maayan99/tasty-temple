import React from 'react';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <LoginForm />
    </div>
  );
}
