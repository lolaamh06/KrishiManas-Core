require('dotenv').config();
const admin = require('firebase-admin');

let db = null;
const isFirebaseReady = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'PLACEHOLDER';

if (isFirebaseReady) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey
      })
    });
    db = admin.firestore();
    console.log('Firebase initialized successfully.');
  } catch(e) {
    console.warn('Firebase initialization failed: ', e.message);
  }
}

module.exports = { db, isFirebaseReady };
