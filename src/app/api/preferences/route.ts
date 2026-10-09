import { NextResponse } from 'next/server';
import { z } from 'zod';
import { api, authenticated, body, sameOrigin, rateLimit, ApiError } from '@/lib/server/platform';

const folder = z.object({ id: z.string().uuid(), name: z.string().trim().min(1).max(80) }).strict();
const schema = z.object({
  favorites: z.array(z.string().trim().min(1).max(100)).max(500),
  folders: z.array(folder).max(100),
  lessonIds: z.array(z.string().trim().min(1).max(100)).max(500),
}).strict();

export const GET = () => api(async () => {
  const { db, user } = await authenticated();
  const { data, error } = await db.from('progress_preferences').select('favorites,folders,lesson_ids,updated_at').eq('user_id', user.id).maybeSingle();
  if (error) throw new ApiError(503, 'Cloud preferences are unavailable.');
  return NextResponse.json({ preferences: data ? { favorites: data.favorites, folders: data.folders, lessonIds: data.lesson_ids, updatedAt: data.updated_at } : null }, { headers: { 'Cache-Control': 'no-store' } });
});

export const PUT = (request: Request) => api(async () => {
  sameOrigin(request);
  const { db, user } = await authenticated();
  await rateLimit(user.id, 'preferences', 20);
  const input = schema.parse(await body(request));
  const favorites = [...new Set(input.favorites)];
  const lessonIds = [...new Set(input.lessonIds)];
  const folderIds = new Set(input.folders.map(item => item.id));
  if (folderIds.size !== input.folders.length) throw new ApiError(400, 'Folder IDs must be unique.');
  const { data, error } = await db.from('progress_preferences').upsert({ user_id: user.id, favorites, folders: input.folders, lesson_ids: lessonIds, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).select('updated_at').single();
  if (error) throw new ApiError(503, 'Cloud preferences could not be saved.');
  return NextResponse.json({ updatedAt: data.updated_at });
});
