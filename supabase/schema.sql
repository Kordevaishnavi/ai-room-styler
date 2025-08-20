-- ============================================
-- 📌 AI Interior Styler Schema + Policies
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  credits int default 50,
  role text default 'user', -- 'user' or 'admin'
  status text default 'active', -- 'active' or 'blocked'
  created_at timestamp default now()
);

-- PROJECTS TABLE
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  created_at timestamp default now()
);

-- RENDERS TABLE
create table if not exists renders (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  before_image_url text not null,
  after_image_url text,
  style text not null,
  created_at timestamp default now()
);

-- STYLES TABLE
create table if not exists styles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  created_at timestamp default now()
);

-- Insert default styles (ignore duplicates)
insert into styles (name) values
  ('Industrial'),
  ('Minimalist'),
  ('Rustic'),
  ('Scandinavian'),
  ('Bohemian'),
  ('Modern')
on conflict (name) do nothing;

-- ============================================
-- 📌 Row Level Security (RLS)
-- ============================================
alter table users enable row level security;
alter table projects enable row level security;
alter table renders enable row level security;
alter table styles enable row level security;

-- ============================================
-- 📌 RLS Policies
-- ============================================

-- USERS
create policy "Users can view own data" on users
for select using (auth.uid() = id);

create policy "Users can update own credits & status restricted" on users
for update using (auth.uid() = id);

-- PROJECTS
create policy "Users can create project" on projects
for insert with check (auth.uid() = user_id);

create policy "Users can view own projects" on projects
for select using (auth.uid() = user_id);

create policy "Users can modify own projects" on projects
for update using (auth.uid() = user_id);

create policy "Users can delete own projects" on projects
for delete using (auth.uid() = user_id);

-- RENDERS
create policy "Users can insert renders for their project" on renders
for insert with check (
  auth.uid() in (select user_id from projects where projects.id = project_id)
);

create policy "Users can view own renders" on renders
for select using (
  auth.uid() in (select user_id from projects where projects.id = project_id)
);

-- STYLES
create policy "All users can view styles" on styles
for select using (true);

create policy "Only admins can modify styles" on styles
for all using (
  auth.uid() in (select id from users where role = 'admin')
);

-- ============================================
-- 📌 Supabase Storage Bucket
-- ============================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Public read access
create policy "Public read access"
on storage.objects for select
using (bucket_id = 'project-images');

-- Users can upload only into their own folder (user_id/...)
create policy "Users can upload in their folder"
on storage.objects for insert
with check (
  bucket_id = 'project-images'
  and (split_part(name, '/', 1) = auth.uid()::text)
);
