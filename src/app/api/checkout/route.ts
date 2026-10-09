import Stripe from 'stripe';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { api, authenticated, body, sameOrigin, rateLimit, required, ApiError } from '@/lib/server/platform';

export const POST = (request:Request) => api(async()=>{
  sameOrigin(request);
  if(process.env.PAID_PLANS_READY!=='true') throw new ApiError(503,'Paid plans are not available yet.');
  const {user,db}=await authenticated();
  await rateLimit(user.id,'checkout',5);
  const {data:existing,error:lookupError}=await db.from('subscriptions').select('status,expires_at').eq('user_id',user.id).maybeSingle();
  if(lookupError) throw new ApiError(503,'Subscription status is temporarily unavailable.');
  if(existing && ['active','trialing'].includes(existing.status) && new Date(existing.expires_at).getTime()>Date.now()) throw new ApiError(409,'You already have an active subscription. Contact support to change plans.');
  const {plan,interval}=z.object({plan:z.enum(['pro','premium']),interval:z.enum(['month','year'])}).strict().parse(await body(request));
  const stripe=new Stripe(required('STRIPE_SECRET_KEY'));
  const session=await stripe.checkout.sessions.create({mode:'subscription',client_reference_id:user.id,customer_email:user.email,metadata:{user_id:user.id},subscription_data:{metadata:{user_id:user.id}},line_items:[{price:required(`STRIPE_PRICE_${plan.toUpperCase()}_${interval.toUpperCase()}`),quantity:1}],success_url:`${required('NEXT_PUBLIC_SITE_URL')}/pricing?checkout=success`,cancel_url:`${required('NEXT_PUBLIC_SITE_URL')}/pricing?checkout=cancelled`});
  return NextResponse.json({url:session.url});
});
