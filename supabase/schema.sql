create extension if not exists "pgcrypto";

create type workflow_status as enum ('pending', 'approved', 'rejected');
create type workflow_priority as enum ('low', 'medium', 'high', 'urgent');

create table if not exists workflow_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  requester text not null,
  request_type text not null,
  department text not null,
  priority workflow_priority not null default 'medium',
  approver text not null,
  summary text not null,
  status workflow_status not null default 'pending',
  comments text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_logs (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references workflow_requests(id) on delete set null,
  actor text not null,
  action text not null,
  details text not null,
  created_at timestamptz not null default now()
);

create index if not exists workflow_requests_status_idx on workflow_requests(status);
create index if not exists workflow_requests_department_idx on workflow_requests(department);
create index if not exists workflow_requests_created_at_idx on workflow_requests(created_at desc);
create index if not exists activity_logs_created_at_idx on activity_logs(created_at desc);

alter table workflow_requests enable row level security;
alter table activity_logs enable row level security;

create policy "workflow_requests_read_all"
  on workflow_requests for select
  using (true);

create policy "workflow_requests_insert_all"
  on workflow_requests for insert
  with check (true);

create policy "workflow_requests_update_all"
  on workflow_requests for update
  using (true)
  with check (true);

create policy "activity_logs_read_all"
  on activity_logs for select
  using (true);

create policy "activity_logs_insert_all"
  on activity_logs for insert
  with check (true);
