import { NextResponse } from 'next/server';
import { z } from 'zod';
import { admin, api, body, sameOrigin, serviceClient, rateLimit, ApiError } from '@/lib/server/platform';

const curatedContent=z.object({title:z.string().trim().min(3).max(160),transcript:z.string().trim().min(20).max(30000),language:z.enum(['en','hi']),wpm:z.number().int().min(20).max(200),difficulty:z.enum(['beginner','intermediate','advanced']),exam:z.string().trim().max(120),published:z.boolean(),premium:z.boolean()}).refine(value=>value.transcript.split(/\s+/u).length<=3000,{message:'Passage cannot exceed 3,000 words.'});

export const GET=(request:Request)=>api(async()=>{
  await admin();
  const db=serviceClient();
  const params=new URL(request.url).searchParams;
  const userPage=z.coerce.number().int().min(0).max(10000).parse(params.get('userPage')??0);
  const dictationPage=z.coerce.number().int().min(0).max(10000).parse(params.get('dictationPage')??0);
  const query=z.string().trim().max(80).parse(params.get('q')??'').replace(/[%_,]/g,'');
  let userQuery=db.from('profiles').select('id,display_name,created_at,suspended',{count:'exact'}).order('created_at',{ascending:false}).range(userPage*20,userPage*20+19);
  let dictationQuery=db.from('dictations').select('id,title,transcript,language,wpm,difficulty,exam,published,premium,owner_id',{count:'exact'}).is('owner_id',null).order('created_at',{ascending:false}).range(dictationPage*20,dictationPage*20+19);
  if(query){userQuery=userQuery.ilike('display_name',`%${query}%`);dictationQuery=dictationQuery.ilike('title',`%${query}%`);}
  const [users,attempts,dictations]=await Promise.all([userQuery,db.from('attempts').select('id',{count:'exact',head:true}),dictationQuery]);
  if(users.error||attempts.error||dictations.error) throw new ApiError(500,'Unable to load admin data.');
  return NextResponse.json({users:users.data,userCount:users.count,attemptCount:attempts.count,dictations:dictations.data,dictationCount:dictations.count,userPage,dictationPage});
});
export const POST=(request:Request)=>api(async()=>{
  sameOrigin(request);
  const {user}=await admin();
  await rateLimit(user.id,'admin',30);
  const input=z.discriminatedUnion('action',[z.object({action:z.literal('suspend'),userId:z.string().uuid(),suspended:z.boolean()}),z.object({action:z.literal('publish'),dictationId:z.string().uuid(),published:z.boolean(),premium:z.boolean()}),z.object({action:z.literal('create-dictation'),content:curatedContent}),z.object({action:z.literal('edit-dictation'),dictationId:z.string().uuid(),content:curatedContent})]).parse(await body(request));
  if(input.action==='suspend'&&input.userId===user.id) throw new ApiError(400,'You cannot suspend your own account.');
  const db=serviceClient();
  if(input.action==='suspend'){
    const {data,error}=await db.from('profiles').update({suspended:input.suspended}).eq('id',input.userId).select('id').maybeSingle();
    if(error)throw new ApiError(500,'Admin operation failed.');
    if(!data)throw new ApiError(404,'Learner not found.');
  }else if(input.action==='publish'){
    const {data,error}=await db.from('dictations').update({published:input.published,premium:input.premium}).eq('id',input.dictationId).is('owner_id',null).select('id').maybeSingle();
    if(error)throw new ApiError(500,'Admin operation failed.');
    if(!data)throw new ApiError(404,'Curated dictation not found.');
  }else{
    const {content}=input;
    const values={...content,exam:content.exam||null,word_count:content.transcript.split(/\s+/u).length};
    if(input.action==='create-dictation'){
      const {error}=await db.from('dictations').insert({...values,owner_id:null});
      if(error)throw new ApiError(500,'Dictation could not be created.');
    }else{
      const {data,error}=await db.from('dictations').update(values).eq('id',input.dictationId).is('owner_id',null).select('id').maybeSingle();
      if(error)throw new ApiError(500,'Dictation could not be updated.');
      if(!data)throw new ApiError(404,'Curated dictation not found.');
    }
  }
  return NextResponse.json({ok:true});
});
