'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = doc(firestore, 'users', user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        if (doc) setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}


// export const getRealtimePost = (path: string) => {
//   const postRef = doc(firestore, path);
//   return useDocumentData(postRef);
// };
