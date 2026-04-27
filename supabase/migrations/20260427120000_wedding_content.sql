-- Wedding content tables for the admin panel
-- Story chapters and gallery photos, both publicly readable, editable only by authenticated users.

create extension if not exists "pgcrypto";

create table if not exists public.wedding_story (
  id uuid primary key default gen_random_uuid(),
  position int not null unique,
  year text not null,
  title text not null,
  description text not null,
  image_url text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.wedding_gallery (
  id uuid primary key default gen_random_uuid(),
  position int not null unique,
  alt text not null,
  image_url text not null,
  span text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_on_story on public.wedding_story;
create trigger set_updated_at_on_story
before update on public.wedding_story
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_on_gallery on public.wedding_gallery;
create trigger set_updated_at_on_gallery
before update on public.wedding_gallery
for each row execute function public.set_updated_at();

alter table public.wedding_story enable row level security;
alter table public.wedding_gallery enable row level security;

drop policy if exists "Wedding story is publicly readable" on public.wedding_story;
create policy "Wedding story is publicly readable"
  on public.wedding_story for select
  using (true);

drop policy if exists "Authenticated users manage wedding story" on public.wedding_story;
create policy "Authenticated users manage wedding story"
  on public.wedding_story for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Wedding gallery is publicly readable" on public.wedding_gallery;
create policy "Wedding gallery is publicly readable"
  on public.wedding_gallery for select
  using (true);

drop policy if exists "Authenticated users manage wedding gallery" on public.wedding_gallery;
create policy "Authenticated users manage wedding gallery"
  on public.wedding_gallery for all
  to authenticated
  using (true)
  with check (true);

alter publication supabase_realtime add table public.wedding_story;
alter publication supabase_realtime add table public.wedding_gallery;

insert into storage.buckets (id, name, public)
values ('wedding-content', 'wedding-content', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can read wedding content" on storage.objects;
create policy "Public can read wedding content"
  on storage.objects for select
  using (bucket_id = 'wedding-content');

drop policy if exists "Authenticated can upload wedding content" on storage.objects;
create policy "Authenticated can upload wedding content"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'wedding-content');

drop policy if exists "Authenticated can update wedding content" on storage.objects;
create policy "Authenticated can update wedding content"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'wedding-content');

drop policy if exists "Authenticated can delete wedding content" on storage.objects;
create policy "Authenticated can delete wedding content"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'wedding-content');
