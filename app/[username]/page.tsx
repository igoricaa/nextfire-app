import PostFeed from '@/components/PostFeed';
import UserProfile from '@/components/UserProfile';
import { getUserWithUsername, postToJSON, firestore } from '@/lib/firebase';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const getUserAndPosts = async ({ username }: { username: string }) => {
    'use server';

    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
      return {
        notFound: true,
      };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
      user = userDoc.data();

      const postsQuery = query(
        collection(firestore, userDoc.ref.path, 'posts'),
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      posts = (await getDocs(postsQuery)).docs.map(postToJSON);
    }

    return { user, posts };
  };

  const username = params!.username;
  const { user, posts } = await getUserAndPosts({ username });

  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts || []} admin={false} />
    </main>
  );
}
