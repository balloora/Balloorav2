-- =============================================================================
-- Migration: 20261009120000_categories
-- =============================================================================
-- Moves product categories (previously hardcoded in the app) into an
-- admin-managed `categories` table.
--
--   * Seeds the original six categories, plus any category name already used
--     by a product, so existing data stays valid.
--   * products.category becomes a foreign key to categories.name:
--       - renaming a category renames it on every product (ON UPDATE CASCADE)
--       - deleting a category leaves its products uncategorised (ON DELETE SET NULL)
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL Editor)
-- Depends on:  20260913120000_initial_schema
-- =============================================================================

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (length(trim(name)) > 0),
  slug        text not null unique,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx on public.categories (sort_order, name);

-- Seed: the original categories, in their original order ---------------------
insert into public.categories (name, slug, sort_order) values
  ('Birthday',          'birthday',          10),
  ('Baby Shower',       'baby-shower',       20),
  ('Gender Reveal',     'gender-reveal',     30),
  ('Weddings',          'weddings',          40),
  ('Corporate Events',  'corporate-events',  50),
  ('Special Occasions', 'special-occasions', 60)
on conflict (name) do nothing;

-- Any other category already in use by a product ------------------------------
insert into public.categories (name, slug, sort_order)
select distinct
  p.category,
  trim(both '-' from regexp_replace(lower(p.category), '[^a-z0-9]+', '-', 'g')) || '-' || substr(md5(p.category), 1, 4),
  1000
from public.products p
where p.category is not null
  and trim(p.category) <> ''
on conflict (name) do nothing;

-- Blank categories become NULL so the foreign key can be added.
update public.products set category = null where category is not null and trim(category) = '';

-- Link products to categories by name ------------------------------------------
alter table public.products
  drop constraint if exists products_category_fkey;
alter table public.products
  add constraint products_category_fkey
  foreign key (category) references public.categories (name)
  on update cascade
  on delete set null;

create index if not exists products_category_idx on public.products (category);

-- Row Level Security ------------------------------------------------------------
-- Anyone can read categories. Writes go through the admin panel with the
-- service_role key (bypasses RLS), so no write policies are granted.
alter table public.categories enable row level security;

drop policy if exists "Categories are public" on public.categories;
create policy "Categories are public"
  on public.categories for select
  using (true);
