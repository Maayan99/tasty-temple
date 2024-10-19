import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.cookies.set('auth', Buffer.from(`${username}:${password}`).toString('base64'), {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
      sameSite: 'strict',
    });
    return response;
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
