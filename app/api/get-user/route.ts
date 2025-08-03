// app/api/get-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    }

    const userQuery = await firestore
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userDoc = userQuery.docs[0];
    const user = userDoc.data();

    return NextResponse.json({ user });
  } catch (error) {
    console.error('GET /get-user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
