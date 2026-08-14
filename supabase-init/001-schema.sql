-- ConflictSee local schema bootstrap (docker-compose db service).
-- Mirrors the Supabase tables so contributors can explore the code without a real project.
-- RLS is not enabled here; production uses Supabase with SELECT-only public policies.

create table if not exists events (
  id bigserial primary key,
  timestamp_ist timestamptz,
  headline text,
  summary text,
  detail text,
  category text,
  fact_check_status text,
  published_at timestamptz,
  verified boolean default false,
  is_locked boolean default false
);

create table if not exists prices (
  id bigserial primary key,
  asset_name text,
  price numeric,
  change_pct numeric,
  currency text,
  why_it_matters text
);

create table if not exists countries (
  id bigserial primary key,
  name text,
  code text,
  stance text,
  impact_score numeric,
  un_vote text
);

create table if not exists world_affairs (
  id bigserial primary key,
  country text,
  flag text,
  stance text,
  military_involvement text,
  latest_statement text,
  summary text
);

create table if not exists rumors (
  id bigserial primary key,
  title text,
  source_type text,
  confidence text,
  detail text,
  region text,
  first_seen timestamptz,
  verified boolean default false
);

create table if not exists sources (
  id bigserial primary key,
  name text,
  tier text,
  url text
);

create table if not exists economics_news (
  id bigserial primary key,
  title text unique,
  summary text,
  detail text,
  category text,
  severity text,
  source text,
  published_at timestamptz,
  war_impact_note text,
  source_url text
);

create table if not exists world_affairs_news (
  id bigserial primary key,
  title text unique,
  summary text,
  detail text,
  category text,
  severity text,
  countries text[],
  source text,
  published_at timestamptz,
  source_url text
);

create table if not exists rumors_news (
  id bigserial primary key,
  title text unique,
  summary text,
  detail text,
  category text,
  severity text,
  source text,
  published_at timestamptz,
  verified boolean default false,
  source_url text
);

create table if not exists market_cache (
  id text primary key,
  data jsonb,
  updated_at timestamptz default now()
);