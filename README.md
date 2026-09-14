# 🎈 Balloora

A modern marketplace built with **Next.js (App Router)**, **Supabase**, and **Stripe**.

- 🛍️ Product catalog with server-rendered listings and detail pages
- 🔐 Passwordless auth (Supabase magic links) with Row Level Security
- 🛒 Persistent client-side cart
- 💳 Secure Stripe Checkout with server-side price validation
- 🪝 Stripe webhooks that reconcile orders and decrement inventory
- ✅ Strict TypeScript, ESLint, Prettier, and runtime-validated env vars

---

## Tech stack

| Layer      | Choice                            |
| ---------- | --------------------------------- |
| Framework  | Next.js 15 (App Router, React 19) |
| Language   | TypeScript (strict)               |
| Styling    | Tailwind CSS v4                   |
| Database   | Supabase (Postgres + Auth + RLS)  |
| Payments   | Stripe Checkout + Webhooks        |
| Validation | Zod                               |

---

## 1. Prerequisites

- Node.js **20+**
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account
- (Deployment) A [Vercel](https://vercel.com) account + a GitHub repo

## 2. Install

```bash
npm install
```

## 3. Environment variables

Copy the template and fill in the values (see [`.env.example`](./.env.example) for
where to find each one):

```bash
cp .env.example .env.local
```

| Variable                             | Where to get it                                     | Exposed to browser? |
| ------------------------------------ | --------------------------------------------------- | ------------------- |
| `NEXT_PUBLIC_SITE_URL`               | Your app URL (`http://localhost:3000` locally)      | ✅                  |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase → Settings → API                           | ✅                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase → Settings → API                           | ✅                  |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase → Settings → API                           | ❌ server only      |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys                      | ✅                  |
| `STRIPE_SECRET_KEY`                  | Stripe → Developers → API keys                      | ❌ server only      |
| `STRIPE_WEBHOOK_SECRET`              | Stripe → Developers → Webhooks (or `stripe listen`) | ❌ server only      |

The app validates these at runtime via [`src/lib/env.ts`](./src/lib/env.ts) and
fails fast with a clear message if any are missing.

## 4. Set up the database (migrations)

The schema is tracked as versioned migrations under
[`supabase/migrations/`](./supabase/migrations). This is the source of truth for
the database — apply them, don't hand-edit tables in the dashboard.

**Recommended — Supabase CLI** (`npm i -g supabase` or `brew install supabase/tap/supabase`):

```bash
# One-time: link this folder to your hosted project
supabase login
supabase link --project-ref <your-project-ref>   # from the project URL / Settings

# Apply all migrations to the linked (hosted) database
supabase db push

# Local development stack (Docker) with a full reset + seed
supabase start
supabase db reset      # re-applies every migration, then runs seed.sql
```

**Quick alternative — SQL Editor:** paste the contents of each file in
`supabase/migrations/` (in filename order), then `supabase/seed.sql`, into the
Dashboard → SQL Editor and run them.

### Making future schema changes

Never edit an already-applied migration. Instead, create a new one:

```bash
supabase migration new add_reviews_table   # creates a timestamped .sql file
# ...write your ALTER/CREATE statements in the new file...
supabase db push                           # apply it to the hosted DB
```

> After any schema change, regenerate exact TypeScript types:
>
> ```bash
> supabase gen types typescript --linked > src/types/database.types.ts
> ```

## 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Testing Stripe webhooks locally

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`. Use test card
`4242 4242 4242 4242`, any future expiry, any CVC.

---

## 6. Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Import Project** from the repo.
3. Add every variable from `.env.example` under **Settings → Environment Variables**
   (set `NEXT_PUBLIC_SITE_URL` to your production URL).
4. Deploy.
5. In **Stripe → Developers → Webhooks**, add an endpoint:
   `https://<your-domain>/api/webhooks/stripe`
   subscribed to `checkout.session.completed`, `checkout.session.expired`, and
   `charge.refunded`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET` on Vercel and redeploy.
6. In **Supabase → Authentication → URL Configuration**, add
   `https://<your-domain>/auth/callback` to the redirect allow-list.

---

## Project structure

```
src/
├── app/
│   ├── (auth)/            # login page + auth server actions
│   ├── account/           # protected order history
│   ├── api/
│   │   ├── checkout/      # creates a Stripe Checkout Session (validates prices)
│   │   └── webhooks/stripe/  # fulfills orders on payment
│   ├── auth/callback/     # Supabase OAuth/magic-link exchange
│   ├── cart/              # cart + checkout entry point
│   ├── checkout/success/  # post-payment landing
│   ├── products/[id]/     # product detail
│   └── page.tsx           # marketplace home
├── components/            # UI + product/cart components
├── lib/
│   ├── supabase/          # browser / server / admin / middleware clients
│   ├── cart-context.tsx   # client cart state (localStorage)
│   ├── env.ts             # zod-validated env access
│   ├── stripe.ts          # server Stripe client
│   └── utils.ts
├── types/database.types.ts
└── middleware.ts          # refreshes Supabase session, guards /account
supabase/
├── schema.sql
└── seed.sql
```

## Security notes

- **Prices are never trusted from the client.** The checkout route re-reads
  authoritative prices and inventory from the database before creating a Stripe
  session ([`src/app/api/checkout/route.ts`](./src/app/api/checkout/route.ts)).
- **Orders are written with the service-role key** on the server only; RLS
  blocks clients from inserting or mutating orders directly.
- **Webhook signatures are verified** with `STRIPE_WEBHOOK_SECRET` before any
  order is marked paid.
- The `service_role` key and Stripe secrets are guarded by `server-only` and
  never shipped to the browser.

## Scripts

```bash
npm run dev           # start dev server
npm run build         # production build
npm run start         # run production build
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm run format        # prettier --write
```
