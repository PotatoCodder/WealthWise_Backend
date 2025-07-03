// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseAdminConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!firebaseAdminConfig.projectId || !firebaseAdminConfig.privateKey || !firebaseAdminConfig.clientEmail) {
  throw new Error('❌ Missing Firebase Admin config values in environment variables');
}

const app = !getApps().length
  ? initializeApp({ credential: cert(firebaseAdminConfig) })
  : getApp();

const firestore = getFirestore(app);

export { firestore };
