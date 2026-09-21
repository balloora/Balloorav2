-- =============================================================================
-- Migration: 20260920120000_admin_catalog_and_storage
-- =============================================================================
-- Adapts the marketplace `products` table for an admin-managed catalog and adds
-- a public Storage bucket for product image uploads.
--
--   * seller_id becomes optional (admin-created products have no seller).
--   * `images text[]` holds an ordered gallery; images[0] mirrors image_url.
--   * a public `product-images` Storage bucket serves uploaded photos.
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL Editor)
-- Depends on:  20260913120000_initial_schema
-- =============================================================================

-- Admin-managed products don't belong to a seller ---------------------------
alter table public.products
  alter column seller_id drop not null;

-- Ordered image gallery (public URLs). images[0] is the cover / thumbnail. ---
alter table public.products
  add column if not exists images text[] not null default '{}';

-- =============================================================================
-- Storage: public bucket for product images
-- =============================================================================
-- Public bucket → files are readable by anyone via their public URL. Uploads
-- are performed server-side with the service_role key (bypasses RLS), so no
-- write policy is required here.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Explicit public-read policy (belt and suspenders alongside `public = true`).
drop policy if exists "Public read for product images" on storage.objects;
create policy "Public read for product images"
  on storage.objects for select
  using (bucket_id = 'product-images');
