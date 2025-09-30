import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, updateDoc, increment } from 'firebase/firestore';

interface JournalEntry {
  id: string;
  userId: string;
  day: number;
  reflection: string;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

interface PrayerRequest {
  id: string;
  userId: string;
  nickname: string;
  handle: string;
  request: string;
  prayedCount: number;
  createdAt: Date | { seconds: number; nanoseconds: number };
}

const firebaseConfig = {
  // These will be replaced with actual config values
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInAnonymous = () => signInAnonymously(auth);
export const onAuthStateChange = (callback: (user: User | null) => void) => onAuthStateChanged(auth, callback);

export const signInWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    throw error; // Let the calling component handle the error
  }
};

export const createUserWithEmail = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: unknown) {
    throw error; // Let the calling component handle the error
  }
};

// Firestore functions
export const createUserProfile = async (userId: string, nickname: string, handle: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const profileData = {
      nickname,
      handle,
      createdAt: new Date(),
      currentDay: 1,
      completedDays: [],
      badges: []
    };
    await setDoc(userRef, profileData);
    
    // Also save to local storage as backup
    localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profileData));
  } catch (error) {
    console.warn('Firebase blocked - saving profile to local storage only');
    // Fallback to local storage if Firebase is blocked
    const profileData = {
      nickname,
      handle,
      createdAt: new Date(),
      currentDay: 1,
      completedDays: [],
      badges: []
    };
    localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profileData));
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.warn('Firebase blocked - loading profile from local storage');
    // Fallback to local storage if Firebase is blocked
    const localProfile = localStorage.getItem(`userProfile_${userId}`);
    return localProfile ? JSON.parse(localProfile) : null;
  }
};

export const updateUserProgress = async (userId: string, day: number) => {
  const userRef = doc(db, 'users', userId);
  const userData = await getUserProfile(userId);
  if (userData) {
    const completedDays = [...(userData.completedDays || []), day];
    await updateDoc(userRef, {
      currentDay: day + 1,
      completedDays
    });
  }
};

// Journal functions
export const saveJournalEntry = async (userId: string, day: number, reflection: string) => {
  const journalRef = collection(db, 'journal');
  await addDoc(journalRef, {
    userId,
    day,
    reflection,
    createdAt: new Date()
  });
};

export const getJournalEntries = (userId: string, callback: (entries: JournalEntry[]) => void) => {
  const q = query(
    collection(db, 'journal'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry))
      .filter(entry => entry.userId === userId);
    callback(entries);
  });
};

// Prayer functions
export const addPrayerRequest = async (userId: string, userHandle: string, request: string) => {
  const prayerRef = collection(db, 'prayers');
  await addDoc(prayerRef, {
    userId,
    userHandle,
    request,
    prayerCount: 0,
    createdAt: new Date()
  });
};

export const getPrayerRequests = (callback: (prayers: PrayerRequest[]) => void) => {
  const q = query(
    collection(db, 'prayers'),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const prayers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest));
    callback(prayers);
  });
};

export const incrementPrayerCount = async (prayerId: string) => {
  const prayerRef = doc(db, 'prayers', prayerId);
  await updateDoc(prayerRef, {
    prayerCount: increment(1)
  });
};
