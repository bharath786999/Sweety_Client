'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  return (
    <header className="nav">
      <strong>🍬 Sweety</strong>
      <nav>
        <Link href="/dashboard">Readings</Link>
        <Link href="/reports">Reports</Link>
      </nav>
      <span className="muted">{user?.name}</span>
      <button className="link" onClick={() => { logout(); router.push('/login'); }}>Log out</button>
    </header>
  );
}
