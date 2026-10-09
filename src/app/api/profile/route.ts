import { NextResponse } from 'next/server';
import { z } from 'zod';
import { api, authenticated, body, sameOrigin, rateLimit, ApiError } from '@/lib/server/platform';

export const GET = () => api(async () => {
  const {db,user} = await authenticated();
  const {data,error} = await db.from('profiles').select('id,display_name,target_exam,language,target_wpm,daily_minutes,exam_date,created_at').eq('id',user.id).single();
  if (error) throw new ApiError(500,'Unable to load profile.');
  return NextResponse.json({profile:data});
});
const schema = z.object({display_name:z.string().trim().min(1).max(80).optional(),target_exam:z.string().max(80).optional(),language:z.enum(['en','hi']).optional(),target_wpm:z.number().int().min(10).max(250).optional(),daily_minutes:z.number().int().min(5).max(240).optional(),exam_date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional()}).strict();
export const PATCH = (request: Request) => api(async () => {
  sameOrigin(request);
  const {db,user} = await authenticated();
  await rateLimit(user.id,'profile',20);
  const values = schema.parse(await body(request));
  const {error} = await db.from('profiles').update(values).eq('id',user.id);
  if (error) throw new ApiError(500,'Unable to update profile.');
  return NextResponse.json({ok:true});
});
