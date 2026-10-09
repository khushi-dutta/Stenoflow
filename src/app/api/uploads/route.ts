import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { api, authenticated, body, sameOrigin, rateLimit, ApiError } from '@/lib/server/platform';

export const POST=(request:Request)=>api(async()=>{
  sameOrigin(request);
  const {db,user}=await authenticated();
  await rateLimit(user.id,'upload',10,3600);
  const input=z.object({contentType:z.enum(['audio/mpeg','audio/wav','audio/ogg','application/pdf']),size:z.number().int().positive().max(26214400)}).strict().parse(await body(request));
  const extension={'audio/mpeg':'mp3','audio/wav':'wav','audio/ogg':'ogg','application/pdf':'pdf'}[input.contentType];
  const path=`${user.id}/${randomUUID()}.${extension}`;
  const {data,error}=await db.storage.from('private-content').createSignedUploadUrl(path);
  if(error) throw new ApiError(500,'Unable to start upload.');
  return NextResponse.json({path,token:data.token,signedUrl:data.signedUrl});
});
