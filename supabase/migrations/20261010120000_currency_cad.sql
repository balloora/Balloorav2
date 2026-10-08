-- =============================================================================
-- Migration: 20261010120000_currency_cad
-- =============================================================================
-- Balloora prices in Canadian dollars. The original schema defaulted products
-- and orders to 'usd' (and the admin form never set a currency), so Stripe
-- Checkout charged in USD. Switch the defaults and existing products to CAD.
--
-- Past orders keep the currency they were actually charged in.
--
-- Apply with:  supabase db push   (or paste into the Supabase SQL Editor)
-- =============================================================================

alter table public.products alter column currency set default 'cad';
alter table public.orders   alter column currency set default 'cad';

update public.products set currency = 'cad' where currency <> 'cad';
