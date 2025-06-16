// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount from './serviceAcc.json'; // ✅ Adjust path if needed

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
    })
  : getApp();

const firestore = getFirestore(app);

export { firestore };
