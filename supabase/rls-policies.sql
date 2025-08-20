-- Enable Row Level Security on all tables
alter table users enable row level security;
alter table projects enable row level security;
alter table renders enable row level security;
alter table styles enable row level security;

-- Users table policies
create policy "Users can view own profile" on users
for select using (auth.uid() = id);

create policy "Users can update own profile" on users
for update using (auth.uid() = id);

-- Projects table policies
create policy "Users can create project" on projects
for insert with check (auth.uid() = user_id);

create policy "Users can view own projects" on projects
for select using (auth.uid() = user_id);

create policy "Users can modify own projects" on projects
for update using (auth.uid() = user_id);

create policy "Users can delete own projects" on projects
for delete using (auth.uid() = user_id);

-- Renders table policies
create policy "Users can create renders for own projects" on renders
for insert with check (
  exists (
    select 1 from projects 
    where projects.id = renders.project_id 
    and projects.user_id = auth.uid()
  )
);

create policy "Users can view renders for own projects" on renders
for select using (
  exists (
    select 1 from projects 
    where projects.id = renders.project_id 
    and projects.user_id = auth.uid()
  )
);

create policy "Users can update renders for own projects" on renders
for update using (
  exists (
    select 1 from projects 
    where projects.id = renders.project_id 
    and projects.user_id = auth.uid()
  )
);

create policy "Users can delete renders for own projects" on renders
for delete using (
  exists (
    select 1 from projects 
    where projects.id = renders.project_id 
    and projects.user_id = auth.uid()
  )
);

-- Styles table policies (public read access)
create policy "All users can view styles" on styles
for select using (true);
