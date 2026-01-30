-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profile
create table public.profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  bio_short text,
  bio_medium text,
  bio_long text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profile enable row level security;
create policy "Public read profile" on public.profile for select using (true);
-- Write policy: restricted to admin (see below)

-- 2. Links
create table public.links (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  url text not null,
  icon_name text, -- e.g. "twitter", "github"
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.links enable row level security;
create policy "Public read links" on public.links for select using (true);

-- 3. Works
create table public.works (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  description text,
  content text, -- Markdown or structured
  thumbnail_url text,
  tech_stack text[], -- Array of strings
  role text,
  deployment_url text,
  github_url text,
  is_public boolean default false,
  published_at timestamp with time zone,
  "order" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.works enable row level security;
create policy "Public read works" on public.works for select using (is_public = true);

-- 4. Products
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  url text not null,
  price_display text, -- e.g. "¥1,000" or "Free"
  thumbnail_url text,
  "order" integer default 0,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.products enable row level security;
create policy "Public read products" on public.products for select using (is_public = true);

-- 5. Devices
create table public.devices (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text, -- e.g. "PC", "Audio"
  description text,
  purchase_reason text,
  link_url text,
  "order" integer default 0,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.devices enable row level security;
create policy "Public read devices" on public.devices for select using (is_public = true);

-- 6. News
create table public.news (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text,
  tags text[],
  is_public boolean default true,
  published_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.news enable row level security;
create policy "Public read news" on public.news for select using (is_public = true);

-- 7. Posts (Blog)
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text, -- Markdown
  tags text[],
  thumbnail_url text,
  is_public boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.posts enable row level security;
create policy "Public read posts" on public.posts for select using (is_public = true);

-- Storage (SQL check, though typically setup via UI, this documents the intention)
insert into storage.buckets (id, name, public) 
values ('works', 'works', true)
on conflict (id) do nothing;

create policy "Public read works thumbnails"
on storage.objects for select
using ( bucket_id = 'works' );

-- NOTE: Write access for all tables is restricted effectively to "service_role" only 
-- because no "FOR INSERT/UPDATE/DELETE" policies are defined for 'public' or 'anon' roles.
-- The Next.js App (Admin Area) will use the SERVICE_ROLE_KEY to perform mutations, bypassing RLS.
-- This satisfies "Owner write" in the context of this MVP architecture where Auth.js handles identity 
-- and the server handles authorization before writing to the DB.
