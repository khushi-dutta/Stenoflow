'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { browserAuth } from '@/lib/auth/browser';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNotice('');
    const auth = browserAuth();
    if (!auth) { setNotice('Accounts are being configured.'); setBusy(false); return; }
    const { data: { user } } = await auth.auth.getUser();
    if (!user) { setNotice('This recovery link has expired. Request a new link from sign in.'); setBusy(false); return; }
    const { error } = await auth.auth.updateUser({ password });
    if (error) { setNotice(error.message); setBusy(false); return; }
    router.push('/app'); router.refresh();
  }
  return <main className="min-h-screen bg-[#f8f7f3] px-5 py-16 text-[#18382f]"><div className="mx-auto max-w-md rounded-3xl border border-[#dce8e1] bg-white p-8 shadow-xl shadow-[#18382f]/5"><Link href="/login" className="text-sm font-semibold">← Sign in</Link><h1 className="mt-8 text-3xl font-semibold">Choose a new password</h1><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-medium">New password<input required type="password" minLength={8} autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full rounded-xl border border-[#cbd8cf] px-4 py-3" /></label>{notice && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm">{notice}</p>}<button disabled={busy} className="w-full rounded-xl bg-[#164e3d] px-5 py-3 font-semibold text-white disabled:opacity-50">Save password</button></form></div></main>;
}
