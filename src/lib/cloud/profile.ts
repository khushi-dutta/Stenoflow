'use client';

import type { Profile } from '@/lib/store';
import { browserAuth } from '@/lib/auth/browser';

export type CloudIdentity = { id: string; email: string | undefined };

export async function cloudIdentity(): Promise<CloudIdentity | null> {
  const auth = browserAuth();
  if (!auth) return null;
  const { data: { user } } = await auth.auth.getUser();
  return user ? { id: user.id, email: user.email } : null;
}

export function onCloudAuthChange(callback: () => void) {
  const auth = browserAuth();
  if (!auth) return () => {};
  const { data: { subscription } } = auth.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
}

export async function signOutCloud() {
  const auth = browserAuth();
  if (auth) await auth.auth.signOut();
}

async function checked(response: Response) {
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Account settings could not be saved.');
  return payload;
}

export async function loadCloudProfile(): Promise<Partial<Profile>> {
  const { profile } = await checked(await fetch('/api/profile', { cache: 'no-store' }));
  return {
    name: profile.display_name,
    targetExam: profile.target_exam,
    language: profile.language === 'hi' ? 'Hindi' : 'English',
    targetWpm: profile.target_wpm,
    dailyMinutes: profile.daily_minutes,
    examDate: profile.exam_date || '',
    onboarded: true,
  };
}

export async function saveCloudProfile(profile: Partial<Profile>) {
  const values: Record<string, unknown> = {};
  if (profile.name !== undefined) values.display_name = profile.name;
  if (profile.targetExam !== undefined) values.target_exam = profile.targetExam;
  if (profile.language !== undefined) values.language = profile.language === 'Hindi' ? 'hi' : 'en';
  if (profile.targetWpm !== undefined) values.target_wpm = profile.targetWpm;
  if (profile.dailyMinutes !== undefined) values.daily_minutes = profile.dailyMinutes;
  if (profile.examDate !== undefined) values.exam_date = profile.examDate || null;
  if (!Object.keys(values).length) return;
  await checked(await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }));
}
