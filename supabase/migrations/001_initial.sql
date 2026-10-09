-- Apply once with the Supabase SQL editor or `supabase db push`.
create extension if not exists pgcrypto;

create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 display_name text not null default 'Learner' check (length(display_name) between 1 and 80),
 role text not null default 'learner' check(role in ('learner','admin')),
 suspended boolean not null default false,
 target_exam text not null default 'SSC Stenographer', language text not null default 'en' check(language in ('en','hi')),
 target_wpm integer not null default 100 check(target_wpm between 10 and 250),
 daily_minutes integer not null default 20 check(daily_minutes between 5 and 240), exam_date date,
 created_at timestamptz not null default now()
);
create function public.on_signup() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,display_name) values(new.id,left(coalesce(nullif(new.raw_user_meta_data->>'display_name',''),'Learner'),80)); return new; end $$;
create trigger on_auth_signup after insert on auth.users for each row execute function public.on_signup();

create table public.subscriptions (
 user_id uuid primary key references public.profiles on delete cascade,
 provider_id text unique not null, customer_id text not null,
 plan text not null check(plan in ('free','pro','premium')), status text not null,
 expires_at timestamptz, updated_at timestamptz not null default now()
);
create function public.has_plan(required_plan text default 'pro') returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from subscriptions s join profiles p on p.id=s.user_id where s.user_id=auth.uid() and not p.suspended and s.status in ('active','trialing') and s.expires_at>now() and (s.plan='premium' or (required_plan='pro' and s.plan='pro')))
$$;
create table public.dictation_categories (id uuid primary key default gen_random_uuid(),name text not null unique,slug text not null unique);
create table public.dictations (
 id uuid primary key default gen_random_uuid(),owner_id uuid references public.profiles on delete cascade,
 category_id uuid references public.dictation_categories on delete set null,title text not null check(length(title) between 3 and 160),
 transcript text not null check(length(transcript) between 20 and 30000), language text not null check(language in ('en','hi')),
 wpm integer not null check(wpm between 20 and 200),word_count integer not null check(word_count between 1 and 3000),
 difficulty text not null check(difficulty in ('beginner','intermediate','advanced')),exam text, audio_path text,
 published boolean not null default false,premium boolean not null default false,created_at timestamptz not null default now()
);
create index dictations_browse on public.dictations(language,wpm,difficulty,created_at desc) where published;
create index dictations_owner on public.dictations(owner_id);
create index dictations_search on public.dictations using gin(to_tsvector('simple',title));
create table public.audio_files(id uuid primary key default gen_random_uuid(),dictation_id uuid references public.dictations on delete cascade,owner_id uuid not null references public.profiles on delete cascade,storage_path text not null unique,mime_type text not null,bytes bigint not null check(bytes between 1 and 26214400),created_at timestamptz not null default now());
create table public.typing_tests(id uuid primary key default gen_random_uuid(),dictation_id uuid not null references public.dictations on delete cascade,duration_seconds integer not null check(duration_seconds between 30 and 7200),keyboard_layout text not null default 'QWERTY');
create table public.exam_tests(id uuid primary key default gen_random_uuid(),dictation_id uuid not null references public.dictations on delete cascade,name text not null,instructions text not null,dictation_seconds integer not null,transcription_seconds integer not null,published boolean not null default false);
create table public.attempts (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,
 dictation_id uuid references public.dictations on delete set null,typed_text text not null check(length(typed_text)<=30000),
 elapsed_seconds numeric not null check(elapsed_seconds between 1 and 7200),score jsonb not null,
 verified boolean not null default false,created_at timestamptz not null default now()
);
create index attempts_user_date on public.attempts(user_id,created_at desc);
create index attempts_dictation on public.attempts(dictation_id);
create table public.mistakes(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,attempt_id uuid not null references public.attempts on delete cascade,expected text not null,actual text not null,kind text not null,created_at timestamptz not null default now());
create index mistakes_user_word on public.mistakes(user_id,expected,created_at desc);
create table public.spellings(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,word text not null,mastered boolean not null default false,unique(user_id,word));
create table public.drills(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,title text not null,transcript text not null,created_at timestamptz not null default now());
create table public.courses(id uuid primary key default gen_random_uuid(),title text not null,language text not null,premium boolean not null default false,published boolean not null default false);
create table public.lessons(id uuid primary key default gen_random_uuid(),course_id uuid not null references public.courses on delete cascade,title text not null,content text not null,position integer not null,unique(course_id,position));
create table public.progress(user_id uuid references public.profiles on delete cascade,lesson_id uuid references public.lessons on delete cascade,completed_at timestamptz not null default now(),primary key(user_id,lesson_id));
create table public.achievements(id text primary key,title text not null,description text not null);
create table public.user_achievements(user_id uuid references public.profiles on delete cascade,achievement_id text references public.achievements on delete cascade,awarded_at timestamptz not null default now(),primary key(user_id,achievement_id));
create table public.folders(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,name text not null check(length(name) between 1 and 80),unique(user_id,name));
create table public.user_dictations(user_id uuid references public.profiles on delete cascade,dictation_id uuid references public.dictations on delete cascade,folder_id uuid references public.folders on delete set null,favorite boolean not null default false,primary key(user_id,dictation_id));
create table public.resources(id uuid primary key default gen_random_uuid(),title text not null,category text not null,storage_path text not null,premium boolean not null default false,published boolean not null default false);
create table public.resource_bookmarks(user_id uuid references public.profiles on delete cascade,resource_id uuid references public.resources on delete cascade,primary key(user_id,resource_id));
create table public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid not null references public.profiles on delete cascade,title text not null,body text not null,read_at timestamptz,created_at timestamptz not null default now());
create table public.payments(id text primary key,user_id uuid not null references public.profiles on delete cascade,amount integer not null,currency text not null,status text not null,created_at timestamptz not null default now());
create table public.webhook_events(id text primary key,created_at timestamptz not null default now());
create table public.rate_limits(key text primary key,window_start timestamptz not null default now(),hits integer not null default 1);

-- RLS is enabled for every application table. No browser can award scores or entitlement.
do $$ declare t text; begin
 foreach t in array array['profiles','subscriptions','dictation_categories','dictations','audio_files','typing_tests','exam_tests','attempts','mistakes','spellings','drills','courses','lessons','progress','achievements','user_achievements','folders','user_dictations','resources','resource_bookmarks','notifications','payments','webhook_events','rate_limits'] loop
 execute format('alter table public.%I enable row level security',t);
 end loop;
end $$;
create policy own_profile_read on public.profiles for select using(id=auth.uid());
create policy own_profile_update on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
revoke update on public.profiles from authenticated;
grant update(display_name,target_exam,language,target_wpm,daily_minutes,exam_date) on public.profiles to authenticated;
create policy subscriptions_read on public.subscriptions for select using(user_id=auth.uid());
create policy categories_read on public.dictation_categories for select using(true);
create policy dictations_read on public.dictations for select using(owner_id=auth.uid() or (published and (not premium or public.has_plan('pro'))));
create policy dictations_create on public.dictations for insert with check(owner_id=auth.uid() and not published and not premium);
create policy dictations_update on public.dictations for update using(owner_id=auth.uid()) with check(owner_id=auth.uid() and not published and not premium);
create policy dictations_delete on public.dictations for delete using(owner_id=auth.uid());
do $$ declare t text; begin
 foreach t in array array['attempts','mistakes','user_achievements','payments','notifications'] loop
 execute format('create policy own_read on public.%I for select using(user_id=auth.uid())',t);
 end loop;
 foreach t in array array['spellings','drills','progress','folders','resource_bookmarks'] loop
 execute format('create policy own_records on public.%I for all using(user_id=auth.uid()) with check(user_id=auth.uid())',t);
 execute format('create index on public.%I(user_id)',t);
 end loop;
end $$;
create policy own_saved on public.user_dictations for all using(user_id=auth.uid()) with check(user_id=auth.uid() and (folder_id is null or exists(select 1 from public.folders f where f.id=folder_id and f.user_id=auth.uid())));
create policy notifications_update on public.notifications for update using(user_id=auth.uid());
revoke update on public.notifications from authenticated;
grant update(read_at) on public.notifications to authenticated;
create policy own_audio on public.audio_files for all using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy courses_read on public.courses for select using(published and (not premium or public.has_plan('pro')));
create policy lessons_read on public.lessons for select using(exists(select 1 from public.courses c where c.id=course_id));
create policy resources_read on public.resources for select using(published and (not premium or public.has_plan('premium')));
create policy achievements_read on public.achievements for select using(true);
create policy typing_tests_read on public.typing_tests for select using(exists(select 1 from public.dictations d where d.id=dictation_id));
create policy exam_tests_read on public.exam_tests for select using(published and exists(select 1 from public.dictations d where d.id=dictation_id));

create function public.consume_rate_limit(p_key text,p_limit integer,p_window integer) returns boolean language plpgsql security definer set search_path=public as $$
declare count_now integer;
begin
 insert into rate_limits(key,window_start,hits) values(p_key,now(),1)
 on conflict(key) do update set hits=case when rate_limits.window_start<now()-make_interval(secs=>p_window) then 1 else rate_limits.hits+1 end,
 window_start=case when rate_limits.window_start<now()-make_interval(secs=>p_window) then now() else rate_limits.window_start end returning hits into count_now;
 return count_now<=p_limit;
end $$;
revoke all on function public.consume_rate_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function public.consume_rate_limit(text,integer,integer) to service_role;

create function public.save_attempt(p_user uuid,p_dictation uuid,p_text text,p_seconds numeric,p_score jsonb) returns uuid language plpgsql security definer set search_path=public as $$
declare attempt uuid;
begin
 insert into attempts(user_id,dictation_id,typed_text,elapsed_seconds,score) values(p_user,p_dictation,p_text,p_seconds,p_score) returning id into attempt;
 insert into mistakes(user_id,attempt_id,expected,actual,kind)
 select p_user,attempt,x->>'expected',x->>'actual',x->>'type' from jsonb_array_elements(p_score->'alignment') x where x->>'type'<>'correct';
 insert into user_achievements(user_id,achievement_id) values(p_user,'first-test') on conflict do nothing;
 return attempt;
end $$;
revoke all on function public.save_attempt(uuid,uuid,text,numeric,jsonb) from public,anon,authenticated;
grant execute on function public.save_attempt(uuid,uuid,text,numeric,jsonb) to service_role;

create function public.apply_subscription_event(p_event text,p_user uuid,p_subscription text,p_customer text,p_plan text,p_status text,p_expires timestamptz) returns void language plpgsql security definer set search_path=public as $$
begin
 insert into webhook_events(id) values(p_event) on conflict do nothing;
 if not found then return; end if;
 insert into subscriptions(user_id,provider_id,customer_id,plan,status,expires_at) values(p_user,p_subscription,p_customer,p_plan,p_status,p_expires)
 on conflict(user_id) do update set provider_id=excluded.provider_id,customer_id=excluded.customer_id,plan=excluded.plan,status=excluded.status,expires_at=excluded.expires_at,updated_at=now();
end $$;
revoke all on function public.apply_subscription_event(text,uuid,text,text,text,text,timestamptz) from public,anon,authenticated;
grant execute on function public.apply_subscription_event(text,uuid,text,text,text,text,timestamptz) to service_role;

insert into public.achievements(id,title,description) values('first-test','First step','Complete your first practice session.'),('accuracy-98','Precision','Reach 98 percent accuracy.'),('speed-100','Triple digits','Reach 100 WPM.');
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('private-content','private-content',false,26214400,array['audio/mpeg','audio/wav','audio/ogg','application/pdf']) on conflict(id) do nothing;
create policy private_upload on storage.objects for insert to authenticated with check(bucket_id='private-content' and (storage.foldername(name))[1]=auth.uid()::text);
create policy private_read on storage.objects for select to authenticated using(bucket_id='private-content' and (storage.foldername(name))[1]=auth.uid()::text);
create policy private_delete on storage.objects for delete to authenticated using(bucket_id='private-content' and (storage.foldername(name))[1]=auth.uid()::text);

-- Competitive leaderboard intentionally excludes self-timed practice. Verified attempts
-- must be populated by a trusted proctored timing workflow before publishing rankings.
create view public.leaderboards with (security_invoker=true) as
 select user_id,max((score->>'netWpm')::numeric) as best_wpm,count(*) as tests
 from public.attempts where verified group by user_id;
