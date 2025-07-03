import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    console.log('📥 GET /api/get-expenses-by-category');
    console.log('➡️ userId:', userId);
    console.log('➡️ category:', category);

    if (!userId || !category) {
      return NextResponse.json({ error: 'Missing userId or category' }, { status: 400 });
    }

    const expensesQuery = await firestore
      .collection('expenses')
      .where('userId', '==', userId)
      .where('category', '==', category)
      .get();

    if (expensesQuery.empty) {
      console.warn(`❌ No expenses found for ${userId} in category ${category}`);
      return NextResponse.json({ message: 'No expenses found', expenses: [] }, { status: 200 });
    }

    const expenses = expensesQuery.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ expenses }, { status: 200 });
  } catch (err) {
    console.error('🔥 Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
