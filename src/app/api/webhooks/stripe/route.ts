import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { api, ApiError, required, serviceClient } from '@/lib/server/platform';

export const POST=(request:Request)=>api(async()=>{
  const stripe=new Stripe(required('STRIPE_SECRET_KEY'));
  const signature=request.headers.get('stripe-signature');
  if (!signature) throw new ApiError(400,'Missing signature.');
  let event:Stripe.Event;
  try { event=stripe.webhooks.constructEvent(await request.text(),signature,required('STRIPE_WEBHOOK_SECRET')); }
  catch { throw new ApiError(400,'Invalid signature.'); }
  if (['customer.subscription.created','customer.subscription.updated','customer.subscription.deleted'].includes(event.type)) {
    const received=event.data.object as Stripe.Subscription;
    // Fetch current provider state, so delayed events cannot restore stale entitlements.
    const subscription=await stripe.subscriptions.retrieve(received.id);
    const userId=subscription.metadata.user_id;
    if (!userId || !/^[0-9a-f-]{36}$/i.test(userId)) throw new ApiError(400,'Missing account reference.');
    const priceId=subscription.items.data[0]?.price.id;
    const pro=[process.env.STRIPE_PRICE_PRO_MONTH,process.env.STRIPE_PRICE_PRO_YEAR].filter(Boolean);
    const premium=[process.env.STRIPE_PRICE_PREMIUM_MONTH,process.env.STRIPE_PRICE_PREMIUM_YEAR].filter(Boolean);
    const plan=premium.includes(priceId)?'premium':pro.includes(priceId)?'pro':'free';
    const periodEnd=subscription.items.data[0]?.current_period_end;
    const {error}=await serviceClient().rpc('apply_subscription_event',{p_event:event.id,p_user:userId,p_subscription:subscription.id,p_customer:typeof subscription.customer==='string'?subscription.customer:subscription.customer.id,p_plan:plan,p_status:subscription.status,p_expires:periodEnd?new Date(periodEnd*1000).toISOString():null});
    if(error) throw new ApiError(500,'Webhook could not be persisted.');
  }
  return NextResponse.json({received:true});
});
