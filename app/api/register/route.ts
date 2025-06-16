// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, dob, password, confirmPassword } = body;

    console.log('📥 Registering:', body);

    // Validate required fields
    if (!fullName || !email || !phone || !dob || !password || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    // Check if email is already registered
    const existing = await firestore
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Format current date/time as a string
    const createdAt = new Date().toISOString(); // Example: 2025-06-15T05:12:34.567Z

    // Store user in Firestore
    await firestore.collection('users').add({
      fullName,
      email,
      phone,
      dob,
      password, // ⚠️ Remember to hash later
      createdAt,
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
