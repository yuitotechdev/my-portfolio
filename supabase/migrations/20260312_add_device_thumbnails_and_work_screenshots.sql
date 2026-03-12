alter table public.devices
add column if not exists thumbnail_url text;

alter table public.works
add column if not exists screenshots text[] default '{}'::text[];

insert into storage.buckets (id, name, public)
values
  ('works', 'works', true),
  ('products', 'products', true),
  ('devices', 'devices', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read works thumbnails'
  ) then
    create policy "Public read works thumbnails"
    on storage.objects for select
    using (bucket_id = 'works');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read product thumbnails'
  ) then
    create policy "Public read product thumbnails"
    on storage.objects for select
    using (bucket_id = 'products');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read device thumbnails'
  ) then
    create policy "Public read device thumbnails"
    on storage.objects for select
    using (bucket_id = 'devices');
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read avatars'
  ) then
    create policy "Public read avatars"
    on storage.objects for select
    using (bucket_id = 'avatars');
  end if;
end $$;
