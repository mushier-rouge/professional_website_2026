-- Membership applications: Senior and Fellow grade applications

-- Create application status enum
do $
begin
  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum (
      'draft',
      'submitted',
      'under_review',
      'approved',
      'rejected'
    );
  end if;
end $;

-- Create membership_applications table
create table if not exists public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_grade text not null check (target_grade in ('senior', 'fellow')),
  status public.application_status not null default 'draft',

  -- Application content
  statement text not null, -- Personal statement
  achievements text, -- Professional achievements
  publications text, -- Key publications
  contributions text, -- Contributions to the field

  -- For Fellow nominations
  nominator_id uuid references auth.users(id),
  nomination_letter text,

  -- Metadata
  submitted_at timestamptz,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  decision_notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Constraints
  constraint valid_grade check (target_grade in ('senior', 'fellow')),
  constraint submitted_timestamp check (
    (status = 'submitted' and submitted_at is not null) or
    (status != 'submitted')
  ),
  constraint reviewed_timestamp check (
    (status in ('approved', 'rejected') and reviewed_at is not null) or
    (status not in ('approved', 'rejected'))
  )
);

-- Create indexes
create index if not exists idx_membership_applications_user_id on public.membership_applications(user_id);
create index if not exists idx_membership_applications_status on public.membership_applications(status);
create index if not exists idx_membership_applications_target_grade on public.membership_applications(target_grade);

-- RLS policies
alter table public.membership_applications enable row level security;

-- Users can view their own applications
create policy "Users can view their own applications"
  on public.membership_applications for select
  using (auth.uid() = user_id);

-- Users can create their own applications
create policy "Users can create applications"
  on public.membership_applications for insert
  with check (auth.uid() = user_id);

-- Users can update their own draft applications
create policy "Users can update their own draft applications"
  on public.membership_applications for update
  using (
    auth.uid() = user_id
    and status = 'draft'
  );

-- Admins can view all applications
create policy "Admins can view all applications"
  on public.membership_applications for select
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

-- Admins can update any application
create policy "Admins can update applications"
  on public.membership_applications for update
  using (
    exists (
      select 1 from public.user_roles ur
      join public.roles r on ur.role_id = r.id
      where ur.user_id = auth.uid()
      and r.name = 'admin'
    )
  );

-- Function to approve an application and upgrade member grade
create or replace function public.approve_membership_application(
  application_uuid uuid,
  reviewer_uuid uuid
) returns json as $$
declare
  app_user_id uuid;
  app_target_grade text;
  result json;
begin
  -- Get application details
  select user_id, target_grade
  into app_user_id, app_target_grade
  from public.membership_applications
  where id = application_uuid
  and status = 'under_review';

  if not found then
    return json_build_object(
      'ok', false,
      'message', 'Application not found or not under review'
    );
  end if;

  -- Update application status
  update public.membership_applications
  set
    status = 'approved',
    reviewed_by = reviewer_uuid,
    reviewed_at = now()
  where id = application_uuid;

  -- Upgrade user's membership grade
  update public.profiles
  set membership_grade = app_target_grade
  where user_id = app_user_id;

  return json_build_object(
    'ok', true,
    'message', 'Application approved and grade upgraded'
  );
end;
$$ language plpgsql security definer;

-- Function to reject an application
create or replace function public.reject_membership_application(
  application_uuid uuid,
  reviewer_uuid uuid,
  notes text
) returns json as $$
begin
  update public.membership_applications
  set
    status = 'rejected',
    reviewed_by = reviewer_uuid,
    reviewed_at = now(),
    decision_notes = notes
  where id = application_uuid
  and status = 'under_review';

  if not found then
    return json_build_object(
      'ok', false,
      'message', 'Application not found or not under review'
    );
  end if;

  return json_build_object(
    'ok', true,
    'message', 'Application rejected'
  );
end;
$$ language plpgsql security definer;

-- Trigger to update updated_at timestamp
create or replace function public.update_application_timestamp()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger on_application_update
  before update on public.membership_applications
  for each row execute function public.update_application_timestamp();
