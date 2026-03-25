import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc as fsDoc, 
  setDoc as fsSetDoc, 
  getDoc as fsGetDoc, 
  collection as fsCollection, 
  onSnapshot as fsOnSnapshot, 
  query as fsQuery, 
  addDoc as fsAddDoc, 
  serverTimestamp as fsServerTimestamp, 
  updateDoc as fsUpdateDoc,
  orderBy as fsOrderBy,
  limit as fsLimit,
  where as fsWhere,
  arrayUnion as fsArrayUnion
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-bucket.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "00000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:0000:web:0000"
};

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "";
const isConfigured = apiKey.length > 5 && apiKey !== "demo-api-key" && apiKey !== "VITE_FIREBASE_API_KEY";

let app, auth, db;

// --- Mock Implementations ---
const mockDb = { _isMock: true };
const mockDoc = () => ({ _type: 'doc' });
const mockCollection = () => ({ _type: 'collection' });
const mockQuery = () => ({ _type: 'query' });
const mockOnSnapshot = (q, cb) => { 
  // Immediate empty snapshot to satisfy initialization
  const mockSnap = {
    docs: [],
    empty: true,
    forEach: (fn) => {},
    metadata: { fromCache: true, hasPendingWrites: false },
    exists: () => {
      const u = localStorage.getItem('krishimanas_auth_farmer');
      return !!u;
    },
    data: () => {
      try { return JSON.parse(localStorage.getItem('krishimanas_auth_farmer')) || {}; } 
      catch { return {}; }
    }
  };
  const timer = setTimeout(() => cb(mockSnap), 0);
  return () => clearTimeout(timer); 
};
const mockAddDoc = async () => ({ id: 'mock_' + Date.now() });
const mockUpdateDoc = async () => {};
const mockSetDoc = async () => {};
const mockGetDoc = async () => ({ exists: () => false, data: () => ({}) });
const mockServerTimestamp = () => new Date();
const mockOrderBy = () => ({ _type: 'orderBy' });
const mockLimit = () => ({ _type: 'limit' });
const mockWhere = () => ({ _type: 'where' });
const mockArrayUnion = (val) => [val];

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn("Firebase is not configured! Using high-fidelity mock fallback.");
  auth = {
    onAuthStateChanged: (cb) => { cb(null); return () => {}; },
    signInWithEmailAndPassword: async () => ({ user: { uid: 'mock_uid' } }),
    createUserWithEmailAndPassword: async () => ({ user: { uid: 'mock_uid' } }),
    signOut: async () => {}
  };
  db = mockDb;
}

// --- Unified Exports ---
export const doc = isConfigured ? fsDoc : mockDoc;
export const setDoc = isConfigured ? fsSetDoc : mockSetDoc;
export const getDoc = isConfigured ? fsGetDoc : mockGetDoc;
export const collection = isConfigured ? fsCollection : mockCollection;
export const onSnapshot = isConfigured ? fsOnSnapshot : mockOnSnapshot;
export const query = isConfigured ? fsQuery : mockQuery;
export const addDoc = isConfigured ? fsAddDoc : mockAddDoc;
export const updateDoc = isConfigured ? fsUpdateDoc : mockUpdateDoc;
export const serverTimestamp = isConfigured ? fsServerTimestamp : mockServerTimestamp;
export const orderBy = isConfigured ? fsOrderBy : mockOrderBy;
export const limit = isConfigured ? fsLimit : mockLimit;
export const where = isConfigured ? fsWhere : mockWhere;
export const arrayUnion = isConfigured ? fsArrayUnion : mockArrayUnion;

// --- Business Logic Utilities ---
export const fb = {
  registerUser: async (email, password, roleData) => {
    if (!isConfigured) return { uid: 'mock_' + email };
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await fsSetDoc(fsDoc(db, "users", user.uid), {
      email,
      roles: roleData.roles || ['farmer'],
      name: roleData.name || 'User',
      phone: roleData.phone || '',
      district: roleData.district || 'Hassan',
      createdAt: fsServerTimestamp()
    });
    await fb.logActivity('USER_REGISTERED', `${roleData.name || 'A user'} registered as ${roleData.roles?.join(', ')}`);
    return user;
  },

  loginUser: async (email, password) => {
    if (!isConfigured) return { uid: 'mock_' + email };
    return await signInWithEmailAndPassword(auth, email, password);
  },

  logoutUser: async () => {
    if (!isConfigured) return;
    return await signOut(auth);
  },

  logActivity: async (type, message, extraData = {}) => {
    if (!isConfigured) {
      console.log(`[SYS] ${type}: ${message}`, extraData);
      return;
    }
    await fsAddDoc(fsCollection(db, "global_activities"), {
      type,
      message,
      ...extraData,
      timestamp: fsServerTimestamp()
    });
  }
};

export { auth, db, isConfigured };
