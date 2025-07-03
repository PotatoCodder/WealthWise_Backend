// 🔍 app/api/search-report/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category') || '';
    const date = searchParams.get('date') || '';
    const type = searchParams.get('type') || 'Income';

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const collection = type.toLowerCase() === 'expense' ? 'expenses' : 'incomes';

    let query = firestore.collection(collection).where('userId', '==', userId);

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();

    const filtered = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(item => item.date.includes(date));

    return NextResponse.json({ entries: filtered });
  } catch (err) {
    console.error('🔥 Error in search-report:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
