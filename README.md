# Aura — Style Vault

A style-discovery app for people who shop by aesthetic rather than by brand.
Pick your vibes, browse curated looks, take any look apart down to the shoes,
and resell your own closet into the same tag system.

## The design idea

**The interface wears the aesthetic.** Every screen reads its accent colours from
two CSS variables (`--a1`, `--a2`). Selecting Goth repaints the app in bone and
blood; Y2K repaints it chrome and bubblegum. The palette is content, not
decoration — which is the whole point of an app about aesthetics.

Everything else stays quiet: one display face (Syne), one UI face (Space
Grotesk), glass panels over a slow ambient gradient, and motion reserved for
things the user actually did.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # verified clean on Next 14.2.35
```

Deploy: push to GitHub, import in Vercel or Netlify, no env vars needed for the
mock build.

## Routes

| Route | What it does |
|---|---|
| `/auth` | Login + signup, floating labels, mocked social providers |
| `/onboarding` | Three-step vibe picker; writes `vibes`, `budget`, `fit` to the profile |
| `/for-you` | Personalised feed with a match score per look, promoted items pinned |
| `/vault` | All eight aesthetics; `?q=` turns it into search across looks, brands and pieces |
| `/vault/[aesthetic]` | Curated look grid with slot filtering (`layout` animated) |
| `/vault/[aesthetic]/[outfit]` | Interactive breakdown: hotspots on the figure, itemised buy ledger |
| `/market` | Thrift & Sell — listings, sell dropzone, promotion tiers |
| `/saved` | Everything the user bookmarked |

## Structure

```
app/
  layout.jsx            fonts, ambient field, AuraProvider
  page.jsx              routes you to /auth, /onboarding or /for-you
  auth/ onboarding/     pre-session screens
  (app)/layout.jsx      rail + dock nav, search bar, modals, toast
  (app)/…               the seven in-session routes
components/
  motion.jsx            Magnetic, Tilt, Page (Framer Motion primitives)
  ui.jsx                Field, Modal, Toast, Badge
  cards.jsx             OutfitCard, AestheticCard, ListingCard
  outfit-detail.jsx     Mannequin + Get-the-look ledger
  sell-modal.jsx        listing form with image dropzone
  pricing-modal.jsx     Spark / Blaze / Icon promotion tiers
lib/
  data.js               all mock content, shaped like the DB
  store.jsx             session, saves, listings (localStorage today)
  supabase-schema.sql   the tables this maps onto
```

## Wiring up Supabase

`lib/data.js` and `lib/store.jsx` are the only two files that need to change.

1. `npm i @supabase/supabase-js`, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Run `lib/supabase-schema.sql` in the SQL editor.
3. Replace, one call at a time:

```js
// lib/store.jsx — auth
const { data } = await supabase.auth.signInWithPassword({ email, password });
const { data } = await supabase.auth.signInWithOAuth({ provider: "google" });

// onboarding
await supabase.from("profiles").update({ vibes, budget, fit }).eq("id", user.id);

// feed
const { data } = await supabase.from("recommended_outfits")
  .select("*, outfit_items(*)").eq("for_user", user.id)
  .order("promoted", { ascending: false }).order("match", { ascending: false });

// saves
await supabase.from("saves").insert({ user_id: user.id, outfit_id: id });

// selling
const { data: file } = await supabase.storage.from("listings").upload(path, image);
await supabase.from("listings").insert({ ...form, seller_id: user.id, image_path: file.path });

// promotion — after Stripe checkout succeeds
await supabase.from("promotions").insert({ listing_id, tier, amount, ends_at });
```

Everything a screen renders already matches a column name, so no reshaping.

## Motion inventory

| Interaction | Implementation |
|---|---|
| Magnetic buttons | `useSpring` on x/y from pointer offset, springs home on leave |
| Card tilt + glare | `useTransform` pointer → `rotateX/rotateY`, radial glare tracks `--mx/--my` |
| Page transitions | `AnimatePresence mode="wait"` in `(app)/layout.jsx` |
| Filter re-flow | `layout` on the grid + `popLayout` so cards slide rather than pop |
| Micro-bounce | `whileTap={{ scale: .93 }}` on chips, `:active` scale on buttons |
| Modals | spring scale-and-rise, Escape to close, scroll lock, focus-visible rings |
| Outfit breakdown | hotspot dots dim every garment except the selected slot |

`useReducedMotion` disables tilt and magnetism, and the stylesheet collapses all
durations under `prefers-reduced-motion`.

## Notes on the mock data

Brands are invented so nothing misattributes a real retailer. Each item's buy
link resolves to a live product search for that brand and piece, so the "Get the
look" flow works end to end before you have affiliate URLs.
