import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const userQuery = await firestore
      .collection('users')
      .where('email', '==', email)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const docRef = userQuery.docs[0].ref;

    await docRef.update({ password });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('🔥 Password update failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }5
}
