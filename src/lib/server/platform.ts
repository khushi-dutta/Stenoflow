import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function required(name: string) {
  const value = process.env[name];
  if (!value) throw new ApiError(503, 'This service is not configured yet. Please try again later.');
  return value;
}
export async function sessionClient() {
  const jar = await cookies();
  return createServerClient(required('NEXT_PUBLIC_SUPABASE_URL'), required('NEXT_PUBLIC_SUPABASE_ANON_KEY'), {
    cookies: { getAll: () => jar.getAll(), setAll: entries => entries.forEach(({name,value,options}) => jar.set(name,value,options)) },
  });
}
export function serviceClient() {
  return createClient(required('NEXT_PUBLIC_SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } });
}
export async function authenticated() {
  const db = await sessionClient();
  const { data: {user}, error } = await db.auth.getUser();
  if (error || !user) throw new ApiError(401, 'Please sign in to continue.');
  const { data: profile, error: profileError } = await db.from('profiles').select('role,suspended').eq('id', user.id).single();
  if (profileError) throw new ApiError(503, 'Your account could not be loaded.');
  if (profile.suspended) throw new ApiError(403, 'This account is suspended.');
  return {db,user,profile};
}
export async function admin() {
  const ctx = await authenticated();
  if (ctx.profile.role !== 'admin') throw new ApiError(403, 'Administrator access required.');
  return ctx;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const requestOrigin = new URL(request.url).origin;
  if (!origin || origin !== requestOrigin) throw new ApiError(403, 'Request origin is not permitted.');
}
export async function rateLimit(userId: string, action: string, limit: number, windowSeconds = 60) {
  const { data, error } = await serviceClient().rpc('consume_rate_limit', { p_key: `${action}:${userId}`, p_limit: limit, p_window: windowSeconds });
  if (error) throw new ApiError(503, 'Request protection is temporarily unavailable.');
  if (!data) throw new ApiError(429, 'Too many requests. Please try again shortly.');
}
export async function body(request: Request) {
  const raw = await request.text();
  if (raw.length > 100_000) throw new ApiError(413, 'Request is too large.');
  try { return JSON.parse(raw); } catch { throw new ApiError(400, 'Invalid JSON.'); }
}
export async function api(handler: () => Promise<Response>) {
  try { return await handler(); } catch (error) {
    if (error instanceof ApiError) return NextResponse.json({error:error.message}, {status:error.status});
    if (error instanceof ZodError || error instanceof RangeError) return NextResponse.json({error:'Invalid request. Please check your entries.'}, {status:400});
    console.error('API request failed', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({error:'Something went wrong. Please try again.'}, {status:500});
  }
}
