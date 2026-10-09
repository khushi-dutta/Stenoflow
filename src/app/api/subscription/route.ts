import { NextResponse } from 'next/server';
import { api, authenticated, ApiError } from '@/lib/server/platform';

export const GET = () => api(async () => {
  const { db, user } = await authenticated();
  const { data, error } = await db.from('subscriptions').select('plan,status,expires_at').eq('user_id', user.id).maybeSingle();
  if (error) throw new ApiError(503, 'Subscription status is temporarily unavailable.');
  const active = Boolean(data && ['active', 'trialing'].includes(data.status) && data.expires_at && new Date(data.expires_at).getTime() > Date.now());
  return NextResponse.json({ subscription: data ? { plan: active ? data.plan : 'free', status: data.status, expiresAt: data.expires_at } : { plan: 'free', status: 'none', expiresAt: null } }, { headers: { 'Cache-Control': 'no-store' } });
});
