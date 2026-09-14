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
  ('00000000-0000-0000-0000-0000000000aa', 'Birthday Balloon Garland Kit', 'birthday-balloon-garland-kit',
   'A 12ft DIY balloon garland in white, cream, and gold — everything you need for a stunning birthday backdrop.',
   8900, 'usd', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'Birthday', 30, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Gold Number Balloon Set', 'gold-number-balloon-set',
   'Two 40-inch foil number balloons in brushed gold. Choose any age at checkout.',
   3400, 'usd', 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800', 'Birthday', 50, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Baby Shower Arch & Florals', 'baby-shower-arch-florals',
   'Neutral organic balloon arch with baby''s breath accents. Perfect for a gender-neutral shower.',
   14500, 'usd', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800', 'Baby Shower', 15, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Gender Reveal Confetti Balloon', 'gender-reveal-confetti-balloon',
   'A giant 36-inch black reveal balloon packed with pink or blue confetti. The big moment, delivered.',
   4200, 'usd', 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800', 'Gender Reveal', 40, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Wedding Ceremony Arch', 'wedding-ceremony-arch',
   'Elegant ivory and gold balloon-and-floral arch, styled for ceremonies and receptions.',
   28000, 'usd', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800', 'Weddings', 8, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Corporate Event Backdrop', 'corporate-event-backdrop',
   'Sleek branded balloon wall for launches, galas, and conferences. Custom colors available.',
   32000, 'usd', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Corporate Events', 10, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Anniversary Bloom Bouquet', 'anniversary-bloom-bouquet',
   'A luxe fresh-flower bouquet in blush and cream, hand-tied and ready to gift.',
   6500, 'usd', 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800', 'Special Occasions', 25, 'active'),
  ('00000000-0000-0000-0000-0000000000aa', 'Celebration Cake Topper Set', 'celebration-cake-topper-set',
   'Gold acrylic toppers and mini balloon sticks to finish any celebration cake.',
   1900, 'usd', 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800', 'Special Occasions', 80, 'active')
on conflict (slug) do nothing;
