import { auth, firestore } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, increment, writeBatch } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

export default function HeartButton({ postRef }: any) {
  const uid: any = auth.currentUser?.uid;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in.
      console.log('user is signed in');
    } else {
      // No user is signed in.
      console.log('no user is signed in');
    }
  });

  const heartRef = doc(firestore, postRef.path, 'hearts', uid);
  const [heartDoc] = useDocumentData(heartRef);

  const addHeart = async () => {
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = writeBatch(firestore);
    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
