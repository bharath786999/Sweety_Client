'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Nav from './Nav';

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!ready || !user) return <p className="muted center">Loading…</p>;
  return (
    <>
      <Nav />
      <main className="container">{children}</main>
    </>
  );
}
