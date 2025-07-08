import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, amount, notes, date, category, account, userId } = body;

    if (!title || !amount || !date || !category || !account || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const createdAt = new Date().toISOString();

    const newDoc = await firestore.collection('expenses').add({
      title,
      amount,
      notes,
      date,
      category,
      account,
      userId,
      createdAt,
    });

    // ✅ Only add to balance if category is Savings
    if (category.toLowerCase() === 'savings') {
      await firestore.collection('balance').add({
        amount,
        type: account,
        userId,
        createdAt,
      });
    }

    return NextResponse.json({
      message: 'Expense added successfully',
      id: newDoc.id,
    });
  } catch (err) {
    console.error('🔥 POST /add-expense error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
