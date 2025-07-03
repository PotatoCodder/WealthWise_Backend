// app/api/get-expenses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    console.log('🔍 GET /api/get-expenses called');
    console.log('➡️ userId:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const expensesQuery = await firestore
      .collection('expenses')
      .where('userId', '==', userId)
      .get();

    if (expensesQuery.empty) {
      console.warn('❌ No expenses found for user:', userId);
      return NextResponse.json(
        { message: 'No expenses found', expenses: [] },
        { status: 200 }
      );
    }

    const expenses = expensesQuery.docs.map((doc) => {
      const data = doc.data();
      console.log('📄 Found expense:', data);
      return {
        id: doc.id,
        ...data,
      };
    });

    return NextResponse.json({ expenses });
  } catch (err) {
    console.error('🔥 Server error in get-expenses:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
