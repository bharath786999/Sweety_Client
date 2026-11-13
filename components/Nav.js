'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const tab = (href, label) => (
    <Link href={href} className={path === href ? 'tab active' : 'tab'}>{label}</Link>
  );
  return (
    <header className="nav">
      <div className="nav-inner">
        <span className="logo">🍬 Sweety</span>
        <nav>{tab('/dashboard', 'Log')}{tab('/reports', 'Reports')}</nav>
        <span className="avatar" title={user?.name}>{user?.name?.[0]?.toUpperCase()}</span>
        <button className="ghost" onClick={() => { logout(); router.push('/login'); }}>Log out</button>
      </div>
    </header>
  );
}