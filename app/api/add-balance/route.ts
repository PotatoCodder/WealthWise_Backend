import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, type, userId } = body;

    if (!amount || !type || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();

    await firestore.collection('balance').add({
      amount,
      type,
      userId,
      createdAt,
    });

    return NextResponse.json({ message: 'Balance updated' });
  } catch (err) {
    console.error('🔥 Error in add-balance:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
