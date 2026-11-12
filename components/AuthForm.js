'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api, { errMsg } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post(isSignup ? '/auth/signup' : '/auth/login', form);
      login(data.token, data.user);
      router.push('/dashboard');
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="card auth" onSubmit={submit}>
      <h1>🍬 Sweety</h1>
      <p className="muted">{isSignup ? 'Create your account' : 'Log in to track your glucose'}</p>
      {isSignup && (
        <label>Name<input value={form.name} onChange={set('name')} autoComplete="name" /></label>
      )}
      <label>Email<input type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
      <label>Password
        <input type="password" value={form.password} onChange={set('password')}
          autoComplete={isSignup ? 'new-password' : 'current-password'} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button disabled={busy}>{busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}</button>
      <p className="muted">
        {isSignup ? <>Already registered? <Link href="/login">Log in</Link></>
                  : <>New here? <Link href="/signup">Sign up</Link></>}
      </p>
    </form>
  );
}
