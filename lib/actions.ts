import { firestore, postToJSON } from '@/lib/firebase';
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

const LIMIT = 10;

export const getPosts = async () => {
  'use server';

  const postsQuery = query(
    collectionGroup(firestore, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  };
};
