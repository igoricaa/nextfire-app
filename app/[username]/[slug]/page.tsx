import styles from '@/styles/Post.module.css';
import { firestore, getUserWithUsername, postToJSON } from '@/lib/firebase';
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
} from 'firebase/firestore';
import { cache, useContext } from 'react';
import { UserContext } from '@/lib/context';
import PostContent from '@/components/PostContent';
import AuthCheck from '@/components/AuthCheck';
import Link from 'next/link';
import HeartButton from '@/components/HeartButton';

const getPost = cache(async (username: string, slug: string): Promise<any> => {
  const userDoc = await getUserWithUsername(username);

  let post = null;
  let path = null;

  if (userDoc) {
    const postRef = doc(firestore, userDoc.ref.path, 'posts', slug);
    const docSnap = await getDoc(postRef);
    post = postToJSON(docSnap);
    path = postRef.path;
  }

  return { post, path };
});

export const dynamicParams = true;

export async function generateStaticParams() {
  const q = query(collectionGroup(firestore, 'posts'), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return paths;
}

export const revalidate = 100;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return {
    title: 'Blog moj ' + params.slug,
  };
}

export default async function Post({
  params,
}: {
  params: { username: string; slug: string };
}) {
  const { post, path } = await getPost(params.username, params.slug);

  const postRef = doc(firestore, path!);
  // const [realtimePost] = useDocumentData(postRef);

  const updatedPost = post; //realtimePost ||

  // const { user: currentUser } = useContext(UserContext);

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={updatedPost} />
      </section>

      <aside className='card'>
        <p>
          <strong>{updatedPost.heartCount || 0} 🤍</strong>
        </p>

        <AuthCheck
          fallback={
            <Link passHref href='/enter'>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          {/* <HeartButton postRef={postRef} /> */}
        </AuthCheck>

        {/* {currentUser?.uid === updatedPost.uid && ( */}
        <Link passHref href={`/admin/${updatedPost.slug}`}>
          <button className='btn-blue'>Edit Post</button>
        </Link>
        {/* )} */}
      </aside>
    </main>
  );
}
