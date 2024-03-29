'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@/lib/context';

export default function AuthCheck(props: any): JSX.Element {
  const { username } = useContext(UserContext);
  return username
    ? props.children
    : props.fallback || <Link href='/enter'>You must be signed in</Link>;
}
