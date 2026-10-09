import { NextResponse } from 'next/server';
import { z } from 'zod';
import { scoreAttempt } from '@/lib/scoring';
import { api, authenticated, body, sameOrigin, rateLimit, ApiError, serviceClient } from '@/lib/server/platform';

export const GET = (request: Request) => api(async () => {
  const {db,user} = await authenticated();
  const page = z.coerce.number().int().min(0).max(10000).parse(new URL(request.url).searchParams.get('page') ?? 0);
  const {data,error} = await db.from('attempts').select('id,dictation_id,score,elapsed_seconds,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).range(page*30,page*30+29);
  if (error) throw new ApiError(500,'Unable to load attempts.');
  return NextResponse.json({attempts:data,page});
});
const schema=z.object({dictationId:z.string().uuid(),typedText:z.string().max(30000),elapsedSeconds:z.number().min(1).max(7200),backspaces:z.number().int().min(0).max(100000).default(0)}).strict();
export const POST = (request: Request) => api(async () => {
  sameOrigin(request);
  const {db,user} = await authenticated();
  await rateLimit(user.id,'attempt',12);
  const input=schema.parse(await body(request));
  const {data:dictation,error} = await db.from('dictations').select('id,transcript').eq('id',input.dictationId).single();
  if (error || !dictation) throw new ApiError(404,'Dictation unavailable or requires a subscription.');
  const score=scoreAttempt(dictation.transcript,input.typedText,input.elapsedSeconds,input.backspaces);
  const {data,error:saveError}=await serviceClient().rpc('save_attempt',{p_user:user.id,p_dictation:dictation.id,p_text:input.typedText,p_seconds:input.elapsedSeconds,p_score:score});
  if (saveError) throw new ApiError(500,'Unable to save this attempt.');
  return NextResponse.json({id:data,score},{status:201});
});
