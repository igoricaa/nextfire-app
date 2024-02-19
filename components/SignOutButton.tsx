'use client';

import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function SignOutButton(): JSX.Element {
  return <button onClick={() => signOut(auth)}>Sign Out</button>;
}
