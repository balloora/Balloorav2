-- =============================================================================
-- Migration: 20261009130000_product_homepage_flag
-- =============================================================================
-- Lets the admin choose which products appear in the homepage Shop preview.
--
-- Until now the homepage showed the 12 newest active products with a photo;
-- those are ticked here so the homepage looks the same after this migration.
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL Editor)
-- Depends on:  20260920120000_admin_catalog_and_storage
-- =============================================================================

alter table public.products
  add column if not exists show_on_homepage boolean not null default false;

update public.products
   set show_on_homepage = true
 where id in (
   select id
     from public.products
    where status = 'active'
      and image_url is not null
    order by created_at desc
    limit 12
 );

create index if not exists products_homepage_idx
  on public.products (created_at desc)
  where show_on_homepage;
