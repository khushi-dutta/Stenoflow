'use client';

import type { ProgressState } from '@/lib/store';

export type CloudPreferences = Pick<ProgressState, 'favorites' | 'folders' | 'lessonIds'>;

async function checked(response: Response) {
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Cloud preferences are unavailable.');
  return payload;
}

export async function loadCloudPreferences(): Promise<CloudPreferences | null> {
  const { preferences } = await checked(await fetch('/api/preferences', { cache: 'no-store' }));
  return preferences ? { favorites: preferences.favorites, folders: preferences.folders, lessonIds: preferences.lessonIds } : null;
}

export async function saveCloudPreferences(state: CloudPreferences): Promise<void> {
  await checked(await fetch('/api/preferences', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ favorites: state.favorites, folders: state.folders, lessonIds: state.lessonIds }),
  }));
}
