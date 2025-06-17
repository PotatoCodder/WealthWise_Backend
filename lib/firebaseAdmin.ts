// lib/firebaseAdmin.ts
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import 'dotenv/config'; // make sure dotenv is loaded

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: '', // optional
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: '',
};

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as any),
    })
  : getApp();

const firestore = getFirestore(app);

export { firestore };
