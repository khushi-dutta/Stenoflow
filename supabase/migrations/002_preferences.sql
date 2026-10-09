-- Cloud preferences contain identifiers and folder labels only; practice transcripts stay local.
create table public.progress_preferences (
 user_id uuid primary key references public.profiles on delete cascade,
 favorites text[] not null default '{}' check(cardinality(favorites) <= 500),
 folders jsonb not null default '[]'::jsonb check(jsonb_typeof(folders) = 'array' and jsonb_array_length(folders) <= 100),
 lesson_ids text[] not null default '{}' check(cardinality(lesson_ids) <= 500),
 updated_at timestamptz not null default now()
);
alter table public.progress_preferences enable row level security;
grant select, insert on public.progress_preferences to authenticated;
create policy own_preferences_read on public.progress_preferences for select using(user_id=auth.uid());
create policy own_preferences_write on public.progress_preferences for insert with check(user_id=auth.uid());
create policy own_preferences_update on public.progress_preferences for update using(user_id=auth.uid()) with check(user_id=auth.uid());
revoke update on public.progress_preferences from authenticated;
grant update(user_id,favorites,folders,lesson_ids,updated_at) on public.progress_preferences to authenticated;
