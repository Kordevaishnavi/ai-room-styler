-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  credits int default 50,
  role text default 'user',
  status text default 'active',
  created_at timestamp default now()
);

-- Projects table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  created_at timestamp default now()
);

-- Renders table
create table renders (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  before_image_url text not null,
  after_image_url text,
  style text not null,
  created_at timestamp default now()
);

-- Styles table
create table styles (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  created_at timestamp default now()
);

-- Insert default styles
insert into styles (name) values
  ('Industrial'), 
  ('Minimalist'), 
  ('Rustic'),
  ('Scandinavian'), 
  ('Bohemian'), 
  ('Modern');
