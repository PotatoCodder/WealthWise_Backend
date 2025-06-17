import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, category, amount, date, title, notes } = body;

    console.log('🚀 Incoming data:', body);

    // More strict and meaningful validation
    if (
      typeof userId !== 'string' || userId.trim() === '' ||
      typeof category !== 'string' || category.trim() === '' ||
      typeof amount !== 'string' || amount.trim() === '' ||
      typeof date !== 'string' || date.trim() === '' ||
      typeof title !== 'string' || title.trim() === '' ||
      typeof notes !== 'string' // notes can be optional but should be a string
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid fields. All fields are required except notes.' },
        { status: 400 }
      );
    }

    // Save to Firestore
    const docRef = await firestore.collection('expenses').add({
      userId,
      category,
      amount,
      date,
      title,
      notes,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Expense added successfully',
      expenseId: docRef.id,
    });
  } catch (err) {
    console.error('❌ Add Expense Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
