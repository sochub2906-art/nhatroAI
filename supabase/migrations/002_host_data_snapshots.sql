-- Host business data snapshots for primary persistence
create table if not exists host_data_snapshots (
  host_id text primary key references users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  source text default 'app',
  updated_at timestamptz not null default now()
);

create index if not exists idx_host_data_snapshots_updated_at on host_data_snapshots(updated_at desc);

alter table host_data_snapshots enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'host_data_snapshots'
      and policyname = 'Allow all access'
  ) then
    create policy "Allow all access"
      on host_data_snapshots
      for all
      using (true)
      with check (true);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'host_data_snapshots'
  ) then
    alter publication supabase_realtime add table host_data_snapshots;
  end if;
end $$;
