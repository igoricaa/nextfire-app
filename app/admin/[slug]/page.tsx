'use client';

import styles from '@/styles/Admin.module.css';
import AuthCheck from '@/components/AuthCheck';
import { auth, firestore } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

const PostManager = () => {
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { slug } = useParams() as { slug: string };

  const uid: any = auth.currentUser?.uid;

  const postRef = doc(firestore, 'users', uid, 'posts', slug);
  const [post] = useDocumentDataOnce(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='btn-blue'>Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
};

interface PostFormProps {
  defaultValues: any;
  postRef: any;
  preview: boolean;
}
const PostForm = ({ defaultValues, postRef, preview }: PostFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({
    content,
    published,
  }: {
    content: string;
    published: boolean;
  }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: new Date(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register('content', {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

        {errors.content && (
          <p className='text-danger'>{errors.content.message?.toString()}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            type='checkbox'
            {...register('published')}
          />
          <label>Published</label>
        </fieldset>

        <button
          className='btn-red'
          type='submit'
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
