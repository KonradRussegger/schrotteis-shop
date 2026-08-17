-- Schema für den Schrotteis Gwandlstuben Shop
-- In der Supabase SQL-Konsole ausführen (Projekt -> SQL Editor -> New Query)

create extension if not exists "pgcrypto";

-- Kategorien (z.B. Handtaschen, Rucksäcke, Federpennal) — im Admin frei
-- erweiterbar, ohne dass Code angefasst werden muss.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Produkte = Modell (fixer Name), unabhängig von Farbe.
-- Preis liegt bewusst auf Produktebene, nicht pro Farbvariante — falls ihr
-- später farbabhängige Preise braucht, wandert price_cents in die Varianten.
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,               -- Modellname, z.B. "Handtasche Alm"
  category_id uuid references categories(id),
  description text,
  material text,
  dimensions text,                  -- z.B. "42 x 30 x 15 cm"
  price_cents integer not null,     -- Preis in Cent, um Rundungsfehler zu vermeiden
  currency text not null default 'EUR',
  is_active boolean not null default true, -- im Shop sichtbar ja/nein
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Farbvarianten eines Produkts. Jede Variante hat eigenen Lagerbestand und
-- eigene Fotos — die Anzahl der Fotos ist nicht begrenzt (Array-Feld).
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color_name text not null,         -- z.B. "Cognac", "Dunkelbraun"
  color_hex text,                   -- optional, für einen Farbpunkt in der UI
  stock_quantity integer not null default 0,
  images text[] default '{}',       -- beliebig viele Foto-URLs (Supabase Storage)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, color_name)
);

-- Bestellungen. items referenziert jetzt variant_id statt product_id, damit
-- klar ist, welche Farbe bestellt wurde.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  mollie_payment_id text unique,
  status text not null default 'open', -- open | paid | shipped | canceled
  customer_name text not null,
  customer_email text not null,
  shipping_address jsonb not null,     -- { street, zip, city, country }
  items jsonb not null,                -- [{ variant_id, product_name, color_name, qty, price_cents }]
  total_cents integer not null,
  sevdesk_invoice_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_variants_product on product_variants(product_id);

-- Atomares Reduzieren des Lagerbestands einer Farbvariante (verhindert Race
-- Conditions bei gleichzeitigen Bestellungen derselben Variante)
create or replace function decrement_variant_stock(variant_id uuid, amount int)
returns void as $$
  update product_variants
  set stock_quantity = greatest(stock_quantity - amount, 0),
      updated_at = now()
  where id = variant_id;
$$ language sql;

-- Startkategorien
insert into categories (slug, name, sort_order) values
  ('handtaschen', 'Handtaschen', 1),
  ('rucksaecke', 'Rucksäcke', 2),
  ('federpennal', 'Federpennal', 3)
on conflict (slug) do nothing;

-- Row Level Security (RLS): steuert, was über den öffentlichen API-Schlüssel
-- (den die Shop-Seiten im Browser nutzen) sichtbar/änderbar ist. Der
-- service_role-Schlüssel (nur serverseitig, z.B. im Admin-Bereich und in den
-- API-Routen) umgeht RLS ohnehin komplett — die Regeln hier betreffen nur den
-- öffentlichen anon-Schlüssel.

alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;

-- Kategorien: öffentlich lesbar (für die Kategorie-Anzeige im Shop)
create policy "Kategorien sind öffentlich lesbar"
  on categories for select
  using (true);

-- Produkte: öffentlich lesbar, aber nur die aktiv geschalteten
create policy "Aktive Produkte sind öffentlich lesbar"
  on products for select
  using (is_active = true);

-- Farbvarianten: öffentlich lesbar (werden auf der Produktseite gebraucht)
create policy "Farbvarianten sind öffentlich lesbar"
  on product_variants for select
  using (true);

-- Bestellungen: bewusst KEINE Policy für den öffentlichen Schlüssel.
-- Damit ist die orders-Tabelle über den anon-Schlüssel komplett gesperrt
-- (weder lesbar noch schreibbar) — Zugriff nur über den service_role-
-- Schlüssel in den API-Routen (Checkout, Webhook, Admin).
