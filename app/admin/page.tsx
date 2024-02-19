'use client';

import AuthCheck from '@/components/AuthCheck';
import PostFeed from '@/components/PostFeed';
import { UserContext } from '@/lib/context';
import { auth, firestore } from '@/lib/firebase';
import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import kebabCase from 'lodash.kebabcase';
import toast from 'react-hot-toast';
import styles from '../../styles/Admin.module.css';
import { useRouter } from 'next/navigation';

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

const PostList = (): JSX.Element => {
  const uid: any = auth.currentUser?.uid;
  const ref = collection(firestore, 'users', uid, 'posts');
  const postsQuery = query(ref, orderBy('createdAt'));

  const [querySnapshot] = useCollection(postsQuery);

  const posts: any = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
};

const CreateNewPost = () => {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState('');

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: any) => {
    e.preventDefault();
    const uid: any = auth.currentUser?.uid;
    const ref = doc(firestore, 'users', uid, 'posts', slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success('Post created!');

    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        type='text'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='My Awesome Article!'
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type='submit' disabled={!isValid} className='btn-green'>
        Create New Post
      </button>
    </form>
  );
};
