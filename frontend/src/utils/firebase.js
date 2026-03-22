import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
// (Replace with actual keys from Firebase Console later)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-bucket.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "00000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:0000:web:0000"
};

// Initialize Firebase only if we have real keys, otherwise we will mock the exports to prevent crashes
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
// FORCE MOCK MODE: The connected Firebase project does not have Email/Password Auth enabled.
const isConfigured = false; // apiKey.length > 5 && apiKey !== "dummy" && apiKey !== "demo-api-key";

let app, auth, db;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase is not configured! Using mock fallback for UI development.");
  // Mock implementations to keep the UI functional until Firebase is connected
  auth = {
    onAuthStateChanged: (cb) => { cb(null); return () => {}; },
    signInWithEmailAndPassword: async () => ({ user: { uid: 'mock_uid' } }),
    createUserWithEmailAndPassword: async () => ({ user: { uid: 'mock_uid' } }),
    signOut: async () => {}
  };
  
  db = {
    doc: () => ({}),
    setDoc: async () => {},
    getDoc: async () => ({ exists: () => false, data: () => ({}) }),
    collection: () => ({}),
    onSnapshot: () => (() => {}),
    query: () => ({}),
    addDoc: async () => ({ id: 'mock_doc_id' }),
    updateDoc: async () => {}
  };
}

// Utility functions for our specific operations
export const fb = {
  // --- Authentication ---
  registerUser: async (email, password, roleData) => {
    if (!isConfigured) {
      console.log("Mock Register:", email, roleData);
      return { uid: email }; // Mock
    }
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create base user profile
    await setDoc(doc(db, "users", user.uid), {
      email,
      roles: roleData.roles || ['farmer'], // 'farmer', 'mitra', 'admin'
      name: roleData.name || 'User',
      phone: roleData.phone || '',
      district: roleData.district || 'Hassan',
      createdAt: serverTimestamp()
    });
    
    // Log global activity for Admin
    await fb.logActivity('USER_REGISTERED', `${roleData.name || 'A user'} registered as ${roleData.roles?.join(', ')}`);
    return user;
  },

  loginUser: async (email, password) => {
    if (!isConfigured) return { uid: email };
    return await signInWithEmailAndPassword(auth, email, password);
  },

  logoutUser: async () => {
    if (!isConfigured) return;
    return await signOut(auth);
  },

  // --- Real-time Sync Operations ---
  updateFarmerScore: async (uid, newScore, checks = {}, sentiment = '') => {
    if (!isConfigured) return;
    
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      score: newScore,
      lastCheckin: serverTimestamp()
    });

    // Log the checkin for the Admin Feed
    const status = newScore >= 65 ? 'CRITICAL' : newScore >= 35 ? 'WARNING' : 'STABLE';
    await fb.logActivity(`CHECKIN_${status}`, `Farmer updated score to ${newScore}. Sentiment: ${sentiment}`);
  },

  triggerSOS: async (farmerId, farmerName, location) => {
    if (!isConfigured) return;
    
    // Add to active SOS collection
    await addDoc(collection(db, "active_sos"), {
      farmerId,
      farmerName,
      location,
      status: 'pending', // pending, claimed, resolved
      timestamp: serverTimestamp()
    });

    await fb.logActivity(`FARMER_SOS`, `🚨 SOS TRIGGERED by ${farmerName}`);
  },

  claimCase: async (sosId, mitraId, mitraName) => {
    if (!isConfigured) return;
    
    const sosRef = doc(db, "active_sos", sosId);
    await updateDoc(sosRef, {
      status: 'claimed',
      claimedBy: mitraId,
      claimedByName: mitraName,
      claimedAt: serverTimestamp()
    });

    await fb.logActivity(`CASE_CLAIMED`, `Mitra ${mitraName} claimed SOS case.`);
  },

  logActivity: async (type, message) => {
    if (!isConfigured) {
      console.log(`[SYS] ${type}: ${message}`);
      return;
    }
    await addDoc(collection(db, "global_activities"), {
      type,
      message,
      timestamp: serverTimestamp()
    });
  }
};

export { auth, db, isConfigured };
