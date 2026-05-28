-- Arrivio B2B- Services Feature (MVP v1.0)
-- Supabase/Postgres SQL to create required tables for Services + Orders.
--
-- Notes:
-- - This repo currently uses Supabase directly from the frontend (no Express API).
-- - The PDF spec references company_id / employee_id from existing tables; this SQL includes
--   placeholders so you can wire those FKs to your real tables once confirmed.
-- - RLS policies below default to scoping data to `auth.uid()` via `created_by`.

begin;

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- =========================================================
-- services
-- =========================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price_eur numeric(10,2) not null default 0,
  icon_key text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

do $$ begin
  create policy "services_select_active"
    on public.services
    for select
    using (is_active = true);
exception when duplicate_object then null; end $$;

-- =========================================================
-- service_bundles
-- =========================================================
create table if not exists public.service_bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  total_price_eur numeric(10,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.service_bundles enable row level security;

do $$ begin
  create policy "bundles_select_active"
    on public.service_bundles
    for select
    using (is_active = true);
exception when duplicate_object then null; end $$;

-- =========================================================
-- bundle_services (junction)
-- =========================================================
create table if not exists public.bundle_services (
  bundle_id uuid not null references public.service_bundles(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (bundle_id, service_id)
);

alter table public.bundle_services enable row level security;

do $$ begin
  create policy "bundle_services_select"
    on public.bundle_services
    for select
    using (true);
exception when duplicate_object then null; end $$;

-- =========================================================
-- service_orders
-- =========================================================
create type if not exists public.service_order_status as enum (
  'pending',
  'active',
  'delivered',
  'cancelled'
);

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),

  -- Placeholder: link this to your real companies table once confirmed
  company_id uuid null,

  -- Placeholder: link this to your real employees table once confirmed
  employee_id uuid null,

  service_id uuid not null references public.services(id),

  -- Groups bundle orders together (nullable)
  bundle_ref_id uuid null,

  quantity int not null default 1,
  special_requests text null,
  custom_fields jsonb null,

  status public.service_order_status not null default 'pending',

  created_by uuid not null default auth.uid(),
  ordered_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_orders_service_id_idx on public.service_orders(service_id);
create index if not exists service_orders_status_idx on public.service_orders(status);
create index if not exists service_orders_created_by_idx on public.service_orders(created_by);

alter table public.service_orders enable row level security;

do $$ begin
  create policy "orders_select_own"
    on public.service_orders
    for select
    using (created_by = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "orders_insert_own"
    on public.service_orders
    for insert
    with check (created_by = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "orders_update_own"
    on public.service_orders
    for update
    using (created_by = auth.uid())
    with check (created_by = auth.uid());
exception when duplicate_object then null; end $$;

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_service_orders_updated_at on public.service_orders;
create trigger set_service_orders_updated_at
before update on public.service_orders
for each row execute function public.set_updated_at();

commit;

