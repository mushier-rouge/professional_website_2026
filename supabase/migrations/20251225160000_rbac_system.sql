-- RBAC System: Roles, Permissions, and User Role Assignments
-- This migration creates tables for role-based access control

-- Create roles table
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create permissions table
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

-- Create role_permissions junction table
create table if not exists public.role_permissions (
  role_id uuid references public.roles(id) on delete cascade,
  permission_id uuid references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

-- Create user_roles junction table
create table if not exists public.user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id) on delete cascade,
  granted_by uuid references auth.users(id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- Create role_audit_log table for tracking role changes
create table if not exists public.role_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  role_id uuid references public.roles(id) on delete set null,
  action text not null check (action in ('granted', 'revoked')),
  performed_by uuid references auth.users(id) on delete set null,
  performed_at timestamptz not null default now(),
  reason text
);

-- Create indexes for faster lookups
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role_id on public.user_roles(role_id);
create index if not exists idx_role_permissions_role_id on public.role_permissions(role_id);
create index if not exists idx_role_audit_log_user_id on public.role_audit_log(user_id);

-- Insert default roles
insert into public.roles (name, description) values
  ('member', 'Basic member with standard access'),
  ('editor', 'Can manage article submissions and reviews'),
  ('admin', 'Full system administration access'),
  ('reviewer', 'Can review submitted articles')
on conflict (name) do nothing;

-- Insert permissions
insert into public.permissions (name, description) values
  ('article:create', 'Can create new articles'),
  ('article:edit:own', 'Can edit own articles'),
  ('article:edit:any', 'Can edit any article'),
  ('article:delete:own', 'Can delete own articles'),
  ('article:delete:any', 'Can delete any article'),
  ('article:publish', 'Can publish articles'),
  ('article:unpublish', 'Can unpublish articles'),
  ('article:assign_reviewer', 'Can assign reviewers to articles'),
  ('review:create', 'Can create reviews'),
  ('review:view:any', 'Can view any review'),
  ('user:manage_roles', 'Can grant/revoke user roles'),
  ('profile:view:private', 'Can view private profiles'),
  ('profile:edit:any', 'Can edit any profile')
on conflict (name) do nothing;

-- Assign permissions to roles
do $$
declare
  member_role_id uuid;
  editor_role_id uuid;
  admin_role_id uuid;
  reviewer_role_id uuid;
begin
  -- Get role IDs
  select id into member_role_id from public.roles where name = 'member';
  select id into editor_role_id from public.roles where name = 'editor';
  select id into admin_role_id from public.roles where name = 'admin';
  select id into reviewer_role_id from public.roles where name = 'reviewer';

  -- Member permissions
  insert into public.role_permissions (role_id, permission_id)
  select member_role_id, id from public.permissions
  where name in ('article:create', 'article:edit:own', 'article:delete:own')
  on conflict do nothing;

  -- Editor permissions (includes member permissions + more)
  insert into public.role_permissions (role_id, permission_id)
  select editor_role_id, id from public.permissions
  where name in (
    'article:create',
    'article:edit:own',
    'article:edit:any',
    'article:delete:own',
    'article:publish',
    'article:unpublish',
    'article:assign_reviewer',
    'review:view:any'
  )
  on conflict do nothing;

  -- Reviewer permissions
  insert into public.role_permissions (role_id, permission_id)
  select reviewer_role_id, id from public.permissions
  where name in (
    'article:create',
    'article:edit:own',
    'review:create'
  )
  on conflict do nothing;

  -- Admin permissions (all permissions)
  insert into public.role_permissions (role_id, permission_id)
  select admin_role_id, id from public.permissions
  on conflict do nothing;
end $$;

-- RLS Policies

-- Roles table: Anyone can read roles, only admins can modify
alter table public.roles enable row level security;

create policy "Roles are viewable by everyone"
  on public.roles for select
  using (true);

create policy "Only admins can manage roles"
  on public.roles for all
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

-- Permissions table: Anyone can read permissions
alter table public.permissions enable row level security;

create policy "Permissions are viewable by everyone"
  on public.permissions for select
  using (true);

-- Role permissions: Anyone can read
alter table public.role_permissions enable row level security;

create policy "Role permissions are viewable by everyone"
  on public.role_permissions for select
  using (true);

-- User roles: Users can view their own roles, admins can view all
alter table public.user_roles enable row level security;

create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can view all user roles"
  on public.user_roles for select
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

create policy "Only admins can manage user roles"
  on public.user_roles for all
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

-- Role audit log: Viewable by admins
alter table public.role_audit_log enable row level security;

create policy "Only admins can view audit log"
  on public.role_audit_log for select
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

-- Function to check if a user has a specific permission
create or replace function public.user_has_permission(
  user_uuid uuid,
  permission_name text
) returns boolean as $$
begin
  return exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on ur.role_id = rp.role_id
    join public.permissions p on rp.permission_id = p.id
    where ur.user_id = user_uuid
    and p.name = permission_name
  );
end;
$$ language plpgsql security definer;

-- Function to get all permissions for a user
create or replace function public.get_user_permissions(user_uuid uuid)
returns table(permission_name text, permission_description text) as $$
begin
  return query
  select distinct p.name, p.description
  from public.user_roles ur
  join public.role_permissions rp on ur.role_id = rp.role_id
  join public.permissions p on rp.permission_id = p.id
  where ur.user_id = user_uuid
  order by p.name;
end;
$$ language plpgsql security definer;

-- Function to get all roles for a user
create or replace function public.get_user_roles(user_uuid uuid)
returns table(role_name text, role_description text) as $$
begin
  return query
  select r.name, r.description
  from public.user_roles ur
  join public.roles r on ur.role_id = r.id
  where ur.user_id = user_uuid
  order by r.name;
end;
$$ language plpgsql security definer;

-- Trigger to log role changes
create or replace function public.log_role_change()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.role_audit_log (user_id, role_id, action, performed_by)
    values (NEW.user_id, NEW.role_id, 'granted', NEW.granted_by);
  elsif (TG_OP = 'DELETE') then
    insert into public.role_audit_log (user_id, role_id, action, performed_by)
    values (OLD.user_id, OLD.role_id, 'revoked', auth.uid());
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_user_role_change
  after insert or delete on public.user_roles
  for each row execute function public.log_role_change();

-- Grant 'member' role to all existing users who don't have any role yet
do $$
declare
  member_role_id uuid;
begin
  select id into member_role_id from public.roles where name = 'member';

  insert into public.user_roles (user_id, role_id, granted_by)
  select p.user_id, member_role_id, p.user_id
  from public.profiles p
  where not exists (
    select 1 from public.user_roles ur where ur.user_id = p.user_id
  );
end $$;
