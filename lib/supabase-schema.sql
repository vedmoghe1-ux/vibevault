-- Aura — Style Vault
-- Mirrors the shape of lib/data.js exactly, so swapping mock -> live is a
-- one-line change per screen.

create table aesthetics (
  id          text primary key,          -- 'goth', 'old-money', ...
  name        text not null,
  tagline     text not null,
  note        text,                      -- 'lace · leather · chrome'
  a1          text not null,             -- accent 1 (hex) — retints the whole UI
  a2          text not null,             -- accent 2 (hex)
  tone        text not null              -- base surface (hex)
);

create table profiles (
  id          uuid primary key references auth.users on delete cascade,
  handle      text unique not null,
  name        text,
  vibes       text[] not null default '{}',   -- ordered: index 0 is weighted highest
  budget      text,
  fit         text[] default '{}',
  created_at  timestamptz default now()
);

create table outfits (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  blurb       text,
  aesthetic   text references aesthetics(id),
  curator_id  uuid references profiles(id),
  saves       int default 0,
  promoted    boolean default false,
  tier        text,                      -- 'spark' | 'blaze' | 'icon'
  created_at  timestamptz default now()
);

create table outfit_items (
  id          uuid primary key default gen_random_uuid(),
  outfit_id   uuid references outfits(id) on delete cascade,
  slot        text not null check (slot in ('Outerwear','Top','Bottoms','Shoes','Accessories')),
  name        text not null,
  brand       text not null,
  price       numeric(10,2) not null,
  currency    text default 'USD',
  tone        text,                      -- hex, drives the swatch + mannequin fill
  url         text not null,             -- affiliate or direct product link
  position    int default 0
);

create table saves (
  user_id     uuid references profiles(id) on delete cascade,
  outfit_id   uuid references outfits(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (user_id, outfit_id)
);

create table listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid references profiles(id) on delete cascade,
  title       text not null,
  aesthetic   text references aesthetics(id),
  condition   text not null,
  price       numeric(10,2) not null,
  url         text,                      -- external checkout
  notes       text,
  image_path  text,                      -- supabase storage key
  promoted    boolean default false,
  created_at  timestamptz default now()
);

create table promotions (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid references listings(id) on delete cascade,
  tier        text not null check (tier in ('spark','blaze','icon')),
  amount      numeric(10,2) not null,
  starts_at   timestamptz default now(),
  ends_at     timestamptz not null,
  stripe_id   text
);

-- Studio Canvas: one row per saved look. `canvas_items` holds the full
-- layer stack as JSON — each entry mirrors CanvasItem's shape in the
-- client (uid, name, slot, image, tone, x, y, scale, rotation, z), so
-- loading a saved look is a straight JSON.parse back into React state.
create table user_studios (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references profiles(id) on delete cascade,
  title         text not null,
  tags          text[] default '{}',              -- aesthetic ids this look combines
  base_type     text not null check (base_type in ('silhouette','photo')),
  base_photo    text,                              -- storage path, only when base_type = 'photo'
  canvas_items  jsonb not null default '[]',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
alter table user_studios enable row level security;
create policy "own studios" on user_studios for all using (auth.uid() = user_id);

-- Feed ranking used by /for-you. Ships the same weighting the client does now.
create or replace view recommended_outfits as
select o.*,
       least(99, case
         when p.vibes[1] = o.aesthetic then 96
         when p.vibes[2] = o.aesthetic then 91
         when p.vibes[3] = o.aesthetic then 87
         when o.aesthetic = any(p.vibes) then 83
         else 44 + round((o.saves::numeric / 5200) * 22)
       end + case when o.promoted then 1 else 0 end) as match,
       p.id as for_user
from outfits o cross join profiles p;

alter table profiles enable row level security;
alter table saves    enable row level security;
alter table listings enable row level security;

create policy "own profile"  on profiles for all    using (auth.uid() = id);
create policy "own saves"    on saves    for all    using (auth.uid() = user_id);
create policy "read listings" on listings for select using (true);
create policy "own listings"  on listings for all    using (auth.uid() = seller_id);
