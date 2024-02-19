import { initializeApp } from '@firebase/app';
import { getAuth, GoogleAuthProvider } from '@firebase/auth';
import {
  getFirestore,
  limit,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from '@firebase/firestore';

import { getStorage } from '@firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDHiaBfSdezceYQ4eVCIaWpRiaC57Wl608',
  authDomain: 'nextfire-872e7.firebaseapp.com',
  projectId: 'nextfire-872e7',
  storageBucket: 'nextfire-872e7.appspot.com',
  messagingSenderId: '198983962327',
  appId: '1:198983962327:web:7c3028d4c5c8b3b547ea92',
  measurementId: 'G-3V9XSQ30S4',
};

// if (!firebase.apps.length) {
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';

export async function getUserWithUsername(username: string): Promise<any> {
  const q = query(
    collection(firestore, 'users'),
    where('username', '==', username),
    limit(1)
  );

  const userDoc = (await getDocs(q)).docs[0];
  return userDoc;
}

export function postToJSON(doc: any) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

export const fromMillis = Timestamp.fromMillis;
