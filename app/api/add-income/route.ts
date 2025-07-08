// existing imports...
import { firestore } from '@/lib/firebaseAdmin';
import { NextResponse, NextRequest } from 'next/server';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, amount, notes, date, category, account, userId } = body;

    if (!title || !amount || !date || !category || !account || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();

    const docRef = await firestore.collection('incomes').add({
      title,
      amount,
      notes,
      date,
      category,
      account,
      userId,
      createdAt,
    });

    // 👇 Add to balance collection
    await firestore.collection('balance').add({
      amount,
      type: account,
      userId,
      createdAt,
    });

    return NextResponse.json({ message: 'Income added successfully', id: docRef.id });
  } catch (err) {
    console.error('🔥 Income Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
