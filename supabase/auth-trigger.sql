-- Function to handle new auth user creation
create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.users(id, email, credits, created_at)
  values (new.id, new.email, 50, now());
  return new;
exception when unique_violation then
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically create user row when auth user is created
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_auth_user();
