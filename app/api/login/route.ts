// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const userQuery = await firestore
      .collection('users')
      .where('email', '==', email)
      .where('password', '==', password)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = userQuery.docs[0].data();

    return NextResponse.json({
      message: 'Login successful',
      user: {
        email: user.email,
        createdAt: user.timestamp,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
