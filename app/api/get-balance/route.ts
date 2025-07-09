// app/api/get-balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const snapshot = await firestore
      .collection('balance')
      .where('userId', '==', userId)
      .get();

    const balances = snapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ balances });
  } catch (err) {
    console.error('🔥 Error in get-balance:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
