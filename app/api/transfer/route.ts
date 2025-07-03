// app/api/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const { fromAccount, toAccount, amount, date, notes, userId } = await req.json();

    if (!fromAccount || !toAccount || !amount || !date || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const createdAt = new Date().toISOString();
    const parsedAmount = parseFloat(amount);

    const batch = firestore.batch();

    // Record deduction from fromAccount
    const fromRef = firestore.collection('transfers').doc();
    batch.set(fromRef, {
      type: 'debit',
      account: fromAccount,
      amount: parsedAmount,
      userId,
      date,
      notes,
      createdAt,
    });

    // Record addition to toAccount
    const toRef = firestore.collection('transfers').doc();
    batch.set(toRef, {
      type: 'credit',
      account: toAccount,
      amount: parsedAmount,
      userId,
      date,
      notes,
      createdAt,
    });

    await batch.commit();

    return NextResponse.json({ message: 'Transfer recorded successfully' });
  } catch (err) {
    console.error('🔥 Transfer Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
