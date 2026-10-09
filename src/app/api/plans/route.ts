import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { api, ApiError, required } from '@/lib/server/platform';

export const GET = () => api(async () => {
  const stripe = new Stripe(required('STRIPE_SECRET_KEY'));
  const plans: Record<string, Record<string, { amount: number; currency: string; interval: string }>> = {};
  for (const plan of ['pro', 'premium'] as const) {
    plans[plan] = {};
    for (const interval of ['month', 'year'] as const) {
      const price = await stripe.prices.retrieve(required(`STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`));
      if (!price.active || price.type !== 'recurring' || price.recurring?.interval !== interval || price.unit_amount === null) throw new ApiError(503, 'Plan prices are not configured correctly.');
      plans[plan][interval] = { amount: price.unit_amount, currency: price.currency, interval };
    }
  }
  return NextResponse.json({ plans, checkoutReady: process.env.PAID_PLANS_READY === 'true' }, { headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=300' } });
});
