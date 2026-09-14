-- =============================================================================
-- Balloora — seed data (development only)
-- =============================================================================
-- Populates a demo seller and a handful of active products so the marketplace
-- isn't empty on first run. Run AFTER schema.sql.
--
-- Because `products.seller_id` references `profiles(id)` which references
-- `auth.users(id)`, we create a demo auth user first. Safe to re-run.
-- =============================================================================

-- Demo seller auth user (fixed UUID so the seed is idempotent).
insert into auth.users (id, instance_id, aud, role, email, created_at, updated_at)
values (
  '00000000-0000-0000-0000-0000000000aa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo-seller@balloora.example',
  now(),
  now()
)
on conflict (id) do nothing;

-- The on_auth_user_created trigger normally creates the profile; ensure it
-- exists and is marked as a seller.
insert into public.profiles (id, full_name, is_seller)
values ('00000000-0000-0000-0000-0000000000aa', 'Demo Seller', true)
on conflict (id) do update set is_seller = true;

insert into public.products
  (seller_id, title, slug, description, price_cents, currency, image_url, category, inventory, status)
values
  ('00000000-0000-0000-0000-0000000000aa', 'Handmade Ceramic Mug', 'handmade-ceramic-mug',
   'A cozy 12oz stoneware mug, glazed by hand. Microwave and dishwasher safe.',
   2400, 'usd', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800', 'Home', 25, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Linen Tote Bag', 'linen-tote-bag',
   'Durable natural linen tote with reinforced straps. Perfect for market runs.',
   1800, 'usd', 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800', 'Accessories', 40, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Scented Soy Candle', 'scented-soy-candle',
   'Hand-poured soy candle with notes of cedar and vanilla. 50-hour burn time.',
   1600, 'usd', 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?w=800', 'Home', 60, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Leather Notebook', 'leather-notebook',
   'Refillable full-grain leather journal with 200 dotted pages.',
   3200, 'usd', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800', 'Stationery', 15, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Enamel Pin Set', 'enamel-pin-set',
   'A set of three hard-enamel pins with rubber clutch backs.',
   1200, 'usd', 'https://images.unsplash.com/photo-1595425964072-c4b3c6f6a3a2?w=800', 'Accessories', 100, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Cold Brew Coffee Kit', 'cold-brew-coffee-kit',
   'Everything you need to brew smooth cold brew at home. Includes filter carafe.',
   4500, 'usd', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800', 'Kitchen', 20, 'active')
on conflict (slug) do nothing;
