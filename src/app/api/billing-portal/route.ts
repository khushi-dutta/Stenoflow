import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { api, authenticated, sameOrigin, rateLimit, required, ApiError } from '@/lib/server/platform';

export const POST = (request: Request) => api(async () => {
  sameOrigin(request);
  const { db, user } = await authenticated();
  await rateLimit(user.id, 'billing-portal', 5, 3600);
  const { data, error } = await db.from('subscriptions').select('customer_id').eq('user_id', user.id).maybeSingle();
  if (error) throw new ApiError(503, 'Billing status is temporarily unavailable.');
  if (!data?.customer_id) throw new ApiError(404, 'No paid subscription was found for this account.');
  const stripe = new Stripe(required('STRIPE_SECRET_KEY'));
  const session = await stripe.billingPortal.sessions.create({ customer: data.customer_id, return_url: `${required('NEXT_PUBLIC_SITE_URL')}/pricing` });
  return NextResponse.json({ url: session.url });
});
