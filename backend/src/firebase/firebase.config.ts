import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as process from 'node:process';
dotenv.config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_DATABASE_NAME}.firebaseio.com`,
});

export const firestore = admin.firestore();
