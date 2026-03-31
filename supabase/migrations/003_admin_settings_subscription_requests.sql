alter table if exists admin_settings
add column if not exists subscription_requests jsonb not null default '[]'::jsonb;
