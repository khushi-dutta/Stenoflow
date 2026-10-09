'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { browserAuth } from '@/lib/auth/browser';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup' | 'recover'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const available = Boolean(browserAuth());

  async function submit(event: FormEvent) {
    event.preventDefault();
    const auth = browserAuth();
    if (!auth) { setNotice('Accounts are being configured. Please try again later.'); return; }
    setBusy(true); setNotice('');
    try {
      if (mode === 'recover') {
        const { error } = await auth.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/callback?next=/reset-password` });
        if (error) throw error;
        setNotice('If this address has an account, a recovery link has been sent.');
      } else if (mode === 'signup') {
        const { data, error } = await auth.auth.signUp({ email, password, options: { data: { display_name: name.trim().slice(0, 80) }, emailRedirectTo: `${location.origin}/auth/callback` } });
        if (error) throw error;
        if (data.session) { router.push('/app'); router.refresh(); }
        else setNotice('Check your email to confirm your account, then sign in.');
      } else {
        const { error } = await auth.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/app'); router.refresh();
      }
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Please try again.'); }
    finally { setBusy(false); }
  }

  async function google() {
    const auth = browserAuth();
    if (!auth) return;
    setBusy(true);
    const { error } = await auth.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } });
    if (error) { setNotice(error.message); setBusy(false); }
  }

  return <main className="min-h-screen bg-[#f8f7f3] px-5 py-16 text-[#18382f]">
    <div className="mx-auto max-w-md rounded-3xl border border-[#dce8e1] bg-white p-8 shadow-xl shadow-[#18382f]/5">
      <Link href="/" className="text-sm font-semibold">← StenoFlow</Link>
      <h1 className="mt-8 text-3xl font-semibold">{mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset your password'}</h1>
      <p className="mt-2 text-sm text-[#64766d]">{mode === 'recover' ? 'We will email you a secure recovery link.' : 'Keep your practice and progress together.'}</p>
      {!available && <p role="status" className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Accounts are being configured.</p>}
      <form onSubmit={submit} className="mt-7 space-y-4">
        {mode === 'signup' && <label className="block text-sm font-medium">Your name<input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} className="mt-1 w-full rounded-xl border border-[#cbd8cf] px-4 py-3" autoComplete="name" /></label>}
        <label className="block text-sm font-medium">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border border-[#cbd8cf] px-4 py-3" autoComplete="email" /></label>
        {mode !== 'recover' && <label className="block text-sm font-medium">Password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-[#cbd8cf] px-4 py-3" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>}
        {notice && <p role="status" className="rounded-xl bg-[#eef5ee] p-3 text-sm">{notice}</p>}
        <button disabled={busy || !available} className="w-full rounded-xl bg-[#164e3d] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Send recovery link'}</button>
      </form>
      {mode !== 'recover' && <button disabled={busy || !available} onClick={google} className="mt-3 w-full rounded-xl border border-[#cbd8cf] px-5 py-3 font-medium disabled:opacity-50">Continue with Google</button>}
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm underline underline-offset-4">
        <button onClick={()=>{setMode(mode === 'login' ? 'signup' : 'login');setNotice('');}}>{mode === 'login' ? 'Create an account' : 'Back to sign in'}</button>
        {mode !== 'recover' && <button onClick={()=>{setMode('recover');setNotice('');}}>Forgot password?</button>}
      </div>
    </div>
  </main>;
}
