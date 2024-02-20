'use client';

import Loader from '@/components/Loader';
import PostFeed from '@/components/PostFeed';
import { firestore, postToJSON } from '@/lib/firebase';
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

const LIMIT = 10;

export default function Home(props: any) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  // TODO: Refactor into custom hook
  // TODO: server action??
  // TODO: prebaci sav state u PostsList recimo, Home nece biti client side pa cu moci da koristim
  // server actions ili ce moci biti async ili generateStaticProps
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const postsQuery = query(
        collectionGroup(firestore, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(LIMIT)
      );

      const postsNew = (await getDocs(postsQuery)).docs.map(postToJSON);

      setPosts(postsNew);
      setLoading(false);
    };
    getPosts();
  }, []);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = query(
      collectionGroup(firestore, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(last.createdAt),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(cursor)).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && 'You have reached the end!'}
    </main>
  );
}
