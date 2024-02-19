'use client';
import { UserContext } from '@/lib/context';
import useUserData from '@/lib/hooks';

export function Providers({ children }: { children: React.ReactNode }) {
  const { user, username } = useUserData();

  return (
    <UserContext.Provider value={{ user, username }}>
      {children}
    </UserContext.Provider>
  );
}
