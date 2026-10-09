import { NextResponse } from 'next/server';
import { z } from 'zod';
import { api, authenticated, body, sameOrigin, rateLimit, ApiError } from '@/lib/server/platform';

export const GET=(request:Request)=>api(async()=>{
  const {db}=await authenticated();
  const params=new URL(request.url).searchParams;
  const query=z.string().max(100).parse(params.get('q')??'').replace(/[%_]/g,'');
  const page=z.coerce.number().int().min(0).max(10000).parse(params.get('page')??0);
  let requestQuery=db.from('dictations').select('id,title,language,wpm,difficulty,exam,premium,word_count,audio_path,owner_id').order('created_at',{ascending:false}).range(page*24,page*24+23);
  if(query) requestQuery=requestQuery.ilike('title',`%${query}%`);
  const {data,error}=await requestQuery;
  if(error) throw new ApiError(500,'Unable to load dictations.');
  return NextResponse.json({dictations:data,page});
});
const schema=z.object({title:z.string().trim().min(3).max(160),transcript:z.string().trim().min(20).max(30000),language:z.enum(['en','hi']),wpm:z.number().int().min(20).max(200),difficulty:z.enum(['beginner','intermediate','advanced']).default('intermediate')}).strict();
export const POST=(request:Request)=>api(async()=>{
  sameOrigin(request);
  const {db,user}=await authenticated();
  await rateLimit(user.id,'content',20,3600);
  const values=schema.parse(await body(request));
  if(values.transcript.split(/\s+/).length>3000) throw new ApiError(400,'Dictations must have no more than 3,000 words.');
  const {data,error}=await db.from('dictations').insert({...values,owner_id:user.id,published:false,premium:false,word_count:values.transcript.split(/\s+/).length}).select('id').single();
  if(error) throw new ApiError(500,'Unable to save dictation.');
  return NextResponse.json(data,{status:201});
});
