-- =======================================================
-- AHVAANAM DEMO SHOWCASE SYSTEM - DATABASE MIGRATION
-- =======================================================
-- Run this script in the Supabase SQL Editor if using Supabase:
-- Dashboard -> SQL Editor -> New Query -> Run

-- 1. Create demo_showcases table
create table if not exists demo_showcases (
  slug text primary key,
  template_id text not null,
  name text not null,
  description text,
  is_published boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS)
alter table demo_showcases enable row level security;

-- 3. Policy: Public read access for published demos only
create policy "Allow public read access to published demo showcases" on demo_showcases
  for select using (is_published = true);

-- 4. Policy: Allow service_role full access
create policy "Allow service_role full access to demo showcases" on demo_showcases
  for all using (true);

-- 5. Seed the 4 official wedding invitation demo templates
insert into demo_showcases (slug, template_id, name, description, is_published)
values
  ('pelli-pandiri', 'pelli-pandiri', 'Pelli Pandiri', 'Traditional Telugu wedding invitation with temple entrance arch, 3D butterfly companion, auspicious toranam, and parchment scroll celebration sections.', true),
  ('gopuram', 'gopuram', 'Gopuram', 'Majestic Dravidian temple gopuram invitation featuring a towering entrance, rising couple reveal, sunset skies, and continuous parchment celebration sections.', true),
  ('rose-mandap', 'rose-mandap', 'Rose Mandap', 'Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation.', true),
  ('lotus-mandap', 'lotus-mandapam', 'Lotus Mandap', 'Cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.', true)
on conflict (slug) do nothing;
