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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Utility functions for our specific operations
export const fb = {
  // --- Authentication ---
  registerUser: async (email, password, roleData) => {
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
    return await signInWithEmailAndPassword(auth, email, password);
  },

  logoutUser: async () => {
    return await signOut(auth);
  },

  // --- Real-time Sync Operations ---
  updateFarmerScore: async (uid, newScore, checks = {}, sentiment = '') => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      score: newScore,
      lastCheckin: serverTimestamp()
    });

    // Log the checkin for the Admin Feed
    const status = newScore >= 65 ? 'CRITICAL' : newScore >= 35 ? 'WARNING' : 'STABLE';
    await fb.logActivity(`CHECKIN_${status}`, `Farmer updated score to ${newScore}. Sentiment: ${sentiment}`);
  },

  completeOnboarding: async (uid, formData, score) => {
    const userRef = doc(db, "users", uid);
    
    // Taluk to Coordinate Mapping for visualization
    const talukCoords = {
      'Hassan': { lat: 13.007, lng: 76.100 },
      'Alur': { lat: 13.000, lng: 76.000 },
      'Sakleshpur': { lat: 12.942, lng: 75.788 },
      'Arsikere': { lat: 13.314, lng: 76.258 },
      'Belur': { lat: 13.165, lng: 75.865 },
      'Channarayapatna': { lat: 12.902, lng: 76.388 },
      'Holenarasipur': { lat: 13.130, lng: 76.240 },
      'Arakalagudu': { lat: 12.766, lng: 76.160 }
    };

    const coords = talukCoords[formData.taluk] || talukCoords['Hassan'];

    const updateData = {
      ...formData,
      ...coords,
      score,
      onboarded: true,
      updatedAt: serverTimestamp()
    };

    await updateDoc(userRef, updateData);
    await fb.logActivity('FARMER_ONBOARDED', `Farmer ${formData.name} completed onboarding from ${formData.taluk}. Score: ${score}`);
  },

  triggerSOS: async (farmerId, farmerName, location) => {
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
    await addDoc(collection(db, "global_activities"), {
      type,
      message,
      timestamp: serverTimestamp()
    });
  }
};

export { auth, db };
