// app/api/get-incomes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const incomesQuery = await firestore
      .collection('incomes')
      .where('userId', '==', userId)
      .get();

    const incomes = incomesQuery.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ incomes });
  } catch (err) {
    console.error('🔥 get-incomes error:', err);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
