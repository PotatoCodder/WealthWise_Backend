import { NextResponse } from 'next/server';
import { firestore } from '@/lib/firebaseAdmin';

export async function GET() {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = (currentMonth - 1 + 12) % 12;
    const currentYear = now.getFullYear();

    const usersSnapshot = await firestore.collection('users').get();
    const notifications: any[] = [];

    for (const doc of usersSnapshot.docs) {
      const userId = doc.id;

      const [incomeSnap, expenseSnap] = await Promise.all([
        firestore.collection('incomes').where('userId', '==', userId).get(),
        firestore.collection('expenses').where('userId', '==', userId).get(),
      ]);

      const currentMonthIncome = incomeSnap.docs.filter((d) => {
        const date = new Date(d.data().date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const prevMonthIncome = incomeSnap.docs.filter((d) => {
        const date = new Date(d.data().date);
        return date.getMonth() === previousMonth && date.getFullYear() === currentYear;
      });

      const currentMonthExpense = expenseSnap.docs.filter((d) => {
        const date = new Date(d.data().date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const prevMonthExpense = expenseSnap.docs.filter((d) => {
        const date = new Date(d.data().date);
        return date.getMonth() === previousMonth && date.getFullYear() === currentYear;
      });

      const sum = (arr) => arr.reduce((acc, item) => acc + parseFloat(item.data().amount), 0);

      const incomeNow = sum(currentMonthIncome);
      const incomeBefore = sum(prevMonthIncome);
      const expenseNow = sum(currentMonthExpense);
      const expenseBefore = sum(prevMonthExpense);

      if (incomeNow < incomeBefore) {
        notifications.push({
          userId,
          message: '⚠️ Your income is lower than last month.',
          date: new Date().toISOString(),
        });
      } else if (expenseNow > expenseBefore) {
        notifications.push({
          userId,
          message: '🚨 Your expenses are higher than last month!',
          date: new Date().toISOString(),
        });
      } else {
        notifications.push({
          userId,
          message: '✅ Your finances look great this month!',
          date: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error('🔥 Error generating notifications:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
