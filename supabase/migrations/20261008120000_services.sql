-- =============================================================================
-- Migration: 20261008120000_services
-- =============================================================================
-- Adds an admin-managed `services` catalog: venues, event packages and other
-- bookable offerings. Unlike products, services aren't bought through the cart;
-- customers request a quote, so price is optional ("starting from").
--
-- Images reuse the public `product-images` Storage bucket (under services/).
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL Editor)
-- Depends on:  20260913120000_initial_schema (product_status, set_updated_at)
-- =============================================================================

create table if not exists public.services (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  slug              text not null unique,
  service_type      text not null default 'Event Package',
  summary           text,
  description       text,
  price_from_cents  integer check (price_from_cents is null or price_from_cents >= 0),
  currency          text not null default 'cad',
  location          text,
  capacity          integer check (capacity is null or capacity > 0),
  image_url         text,
  images            text[] not null default '{}',
  status            product_status not null default 'draft',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists services_status_created_idx
  on public.services (status, created_at desc);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- Row Level Security ----------------------------------------------------------
-- Anyone can read ACTIVE services. Writes go through the admin panel with the
-- service_role key (bypasses RLS), so no write policies are granted.
alter table public.services enable row level security;

drop policy if exists "Active services are public" on public.services;
create policy "Active services are public"
  on public.services for select
  using (status = 'active');
