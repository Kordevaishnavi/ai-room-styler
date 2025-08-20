-- Grant admin role to a user
-- Replace 'your-email@example.com' with the actual email address
update users set role = 'admin' where email = 'your-email@example.com';

-- Check all users and their roles
select id, email, role, credits, status, created_at from users order by created_at desc;

-- Check database statistics
select 
  'users' as table_name, count(*) as count from users
union all
select 
  'projects' as table_name, count(*) as count from projects
union all
select 
  'renders' as table_name, count(*) as count from renders
union all
select 
  'styles' as table_name, count(*) as count from styles;

-- View recent activity
select 
  u.email,
  p.name as project_name,
  r.style,
  r.created_at
from renders r
join projects p on r.project_id = p.id
join users u on p.user_id = u.id
order by r.created_at desc
limit 10;
