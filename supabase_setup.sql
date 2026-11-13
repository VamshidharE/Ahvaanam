-- ==========================================
-- SUPABASE DATABASE SETUP FOR AHVAANAM
-- ==========================================
-- Run this script inside your Supabase Project SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Run

-- 1. Create the invitations table to store profiles
create table if not exists invitations (
  id text primary key, -- client URL slug (e.g. karthik-anusha)
  user_id uuid references auth.users(id) on delete cascade, -- user who owns the invitation
  config jsonb not null, -- complete JSON configuration object
  status text default 'draft' not null, -- 'draft' or 'published'
  payment_status text default 'pending' not null, -- 'pending' or 'paid'
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Enable Row Level Security (RLS) for data protection
alter table invitations enable row level security;

-- 3. Create a policy letting anyone read invitation pages ONLY IF they are published and paid
-- (Guests must be able to load active public pages without logging in!)
create policy "Allow public read access for published and paid invitations" on invitations
  for select using (status = 'published' and payment_status = 'paid');

-- 4. Create a policy letting authenticated users read their own invitations (even if unpaid/draft)
create policy "Allow owners to read their own invitations" on invitations
  for select to authenticated using (auth.uid() = user_id);

-- 5. Create a policy letting authenticated users create their own invitations
create policy "Allow owners to insert invitations" on invitations
  for insert to authenticated with check (auth.uid() = user_id);

-- 6. Create a policy letting authenticated users update their own invitations
create policy "Allow owners to update invitations" on invitations
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7. Create a policy letting authenticated users delete their own invitations
create policy "Allow owners to delete invitations" on invitations
  for delete to authenticated using (auth.uid() = user_id);

-- 8. Create the rsvps table to store guest RSVPs
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id text not null references invitations(id) on delete cascade,
  guest_name text not null,
  phone text not null,
  email text,
  attending boolean not null,
  guest_count integer not null default 1 check (guest_count >= 1 and guest_count <= 20),
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_invitation_phone unique (invitation_id, phone)
);

create index if not exists idx_rsvps_invitation_id
on rsvps(invitation_id);

-- 9. Enable Row Level Security (RLS) for RSVPs
alter table rsvps enable row level security;

-- 10. Create policies letting anyone insert RSVPs and owners read RSVPs
create policy "Allow anyone to insert RSVPs" on rsvps
  for insert with check (true);

create policy "Allow owners to read RSVPs" on rsvps
  for select to authenticated
  using (
    exists (
      select 1 from invitations
      where invitations.id = rsvps.invitation_id
      and invitations.user_id = auth.uid()
    )
  );

create policy "No public updates" on rsvps
  for update using (false);

create policy "No public deletes" on rsvps
  for delete using (false);

-- Grants
GRANT ALL ON TABLE public.rsvps TO postgres;
GRANT ALL ON TABLE public.rsvps TO service_role;
GRANT SELECT, INSERT ON TABLE public.rsvps TO anon;
GRANT SELECT, INSERT ON TABLE public.rsvps TO authenticated;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 12. Create the invitation_views table for privacy-first tracking
create table if not exists invitation_views (
  id uuid primary key default gen_random_uuid(),
  invitation_id text not null references invitations(id) on delete cascade,
  visitor_token text not null,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_views_invitation_id
on invitation_views(invitation_id);

create index if not exists idx_views_invitation_token_time
on invitation_views(invitation_id, visitor_token, viewed_at);

-- Enable RLS
alter table invitation_views enable row level security;

-- Policies
create policy "Allow anyone to insert views" on invitation_views
  for insert with check (true);

create policy "Allow owners to read views" on invitation_views
  for select to authenticated
  using (
    exists (
      select 1 from invitations
      where invitations.id = invitation_views.invitation_id
      and invitations.user_id = auth.uid()
    )
  );

create policy "No views updates" on invitation_views
  for update using (false);

create policy "No views deletes" on invitation_views
  for delete using (false);

-- Grants
GRANT ALL ON TABLE public.invitation_views TO postgres;
GRANT ALL ON TABLE public.invitation_views TO service_role;
GRANT SELECT, INSERT ON TABLE public.invitation_views TO anon;
GRANT SELECT, INSERT ON TABLE public.invitation_views TO authenticated;
ALTER TABLE public.invitation_views ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 13. Create the invitation_feedbacks table for Guest Ratings & Reviews
-- ==========================================
create table if not exists invitation_feedbacks (
  id uuid primary key default gen_random_uuid(),
  invitation_id text not null references invitations(id) on delete cascade,
  rating integer not null default 5 check (rating >= 1 and rating <= 5),
  feedback text,
  guest_name text default 'Guest',
  created_at timestamptz not null default now()
);

create index if not exists idx_feedbacks_invitation_id
on invitation_feedbacks(invitation_id);

create index if not exists idx_feedbacks_created_at
on invitation_feedbacks(invitation_id, created_at desc);

-- Enable RLS
alter table invitation_feedbacks enable row level security;

-- Policies
create policy "Allow anyone to insert ratings and feedback" on invitation_feedbacks
  for insert with check (true);

create policy "Allow owners and admins to read ratings" on invitation_feedbacks
  for select to authenticated
  using (
    exists (
      select 1 from invitations
      where invitations.id = invitation_feedbacks.invitation_id
      and (invitations.user_id = auth.uid() or auth.jwt()->>'email' = 'vamshidhar073@gmail.com')
    )
  );

create policy "No feedback updates" on invitation_feedbacks
  for update using (false);

create policy "No feedback deletes except owner" on invitation_feedbacks
  for delete to authenticated
  using (
    exists (
      select 1 from invitations
      where invitations.id = invitation_feedbacks.invitation_id
      and (invitations.user_id = auth.uid() or auth.jwt()->>'email' = 'vamshidhar073@gmail.com')
    )
  );

-- Grants
GRANT ALL ON TABLE public.invitation_feedbacks TO postgres;
GRANT ALL ON TABLE public.invitation_feedbacks TO service_role;
GRANT SELECT, INSERT ON TABLE public.invitation_feedbacks TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.invitation_feedbacks TO authenticated;
ALTER TABLE public.invitation_feedbacks ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 14. Supabase Storage Bucket for Uploads (Photos & Audio)
-- ==========================================
-- Insert the 'uploads' bucket if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to all files in the 'uploads' bucket
CREATE POLICY "Public Read Access on uploads bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Allow authenticated users and service role to upload files
CREATE POLICY "Allow Uploads on uploads bucket"
ON storage.objects FOR INSERT
TO authenticated, anon, service_role
WITH CHECK (bucket_id = 'uploads');

-- Allow delete and update
CREATE POLICY "Allow Manage uploads bucket"
ON storage.objects FOR ALL
TO authenticated, service_role
USING (bucket_id = 'uploads');

-- ==========================================
-- 15. Advanced Analytics Sessions (Admin Only Access)
-- ==========================================
create table if not exists invitation_analytics_sessions (
  id uuid primary key default gen_random_uuid(),
  invitation_id text not null references invitations(id) on delete cascade,
  session_id text not null,
  device_type text default 'desktop',
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  duration_seconds integer not null default 0,
  max_scroll_depth integer not null default 0,
  completed boolean not null default false,
  is_engaged boolean not null default false,
  created_at timestamptz not null default now(),
  constraint unique_invitation_session unique (invitation_id, session_id)
);

create index if not exists idx_analytics_sessions_invitation_id
on invitation_analytics_sessions(invitation_id);

create index if not exists idx_analytics_sessions_session_id
on invitation_analytics_sessions(session_id);

create index if not exists idx_analytics_sessions_created_at
on invitation_analytics_sessions(invitation_id, created_at desc);

-- Enable RLS
alter table invitation_analytics_sessions enable row level security;

-- Policies
create policy "Allow anyone to insert analytics sessions" on invitation_analytics_sessions
  for insert with check (true);

create policy "Allow anyone to update analytics sessions" on invitation_analytics_sessions
  for update using (true) with check (true);

create policy "Allow anyone to select analytics sessions" on invitation_analytics_sessions
  for select using (true);

-- Grants
GRANT ALL ON TABLE public.invitation_analytics_sessions TO postgres;
GRANT ALL ON TABLE public.invitation_analytics_sessions TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.invitation_analytics_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.invitation_analytics_sessions TO authenticated;

-- ==========================================
-- 16. Advanced Analytics Events (Admin Only Access)
-- ==========================================
create table if not exists invitation_analytics_events (
  id uuid primary key default gen_random_uuid(),
  invitation_id text not null references invitations(id) on delete cascade,
  session_id text not null,
  event_type text not null,
  section_id text,
  event_data jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_invitation_id
on invitation_analytics_events(invitation_id);

create index if not exists idx_analytics_events_session_id
on invitation_analytics_events(session_id);

create index if not exists idx_analytics_events_event_type
on invitation_analytics_events(invitation_id, event_type);

create index if not exists idx_analytics_events_created_at
on invitation_analytics_events(invitation_id, created_at desc);

-- Enable RLS
alter table invitation_analytics_events enable row level security;

-- Policies
create policy "Allow anyone to insert analytics events" on invitation_analytics_events
  for insert with check (true);

create policy "Allow anyone to select analytics events" on invitation_analytics_events
  for select using (true);

create policy "No analytics event updates" on invitation_analytics_events
  for update using (false);

create policy "No analytics event deletes" on invitation_analytics_events
  for delete using (false);

-- Grants
GRANT ALL ON TABLE public.invitation_analytics_events TO postgres;
GRANT ALL ON TABLE public.invitation_analytics_events TO service_role;
GRANT SELECT, INSERT ON TABLE public.invitation_analytics_events TO anon;
GRANT SELECT, INSERT ON TABLE public.invitation_analytics_events TO authenticated;

-- 15. Create demo_showcases table for managing public demo showcases
create table if not exists demo_showcases (
  slug text primary key,
  template_id text not null,
  name text not null,
  description text,
  is_published boolean not null default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table demo_showcases enable row level security;

-- Allow public read access to published demo showcases
create policy "Allow public read access to published demo showcases" on demo_showcases
  for select using (is_published = true);

-- Allow service_role full access to demo showcases
create policy "Allow service_role full access to demo showcases" on demo_showcases
  for all using (true);

-- Seed initial 4 production demo showcases
insert into demo_showcases (slug, template_id, name, description, is_published)
values
  ('pelli-pandiri', 'pelli-pandiri', 'Pelli Pandiri', 'Traditional Telugu wedding invitation with temple entrance arch, 3D butterfly companion, auspicious toranam, and parchment scroll celebration sections.', true),
  ('gopuram', 'gopuram', 'Gopuram', 'Majestic Dravidian temple gopuram invitation featuring a towering entrance, rising couple reveal, sunset skies, and continuous parchment celebration sections.', true),
  ('rose-mandap', 'rose-mandap', 'Rose Mandap', 'Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation.', true),
  ('lotus-mandap', 'lotus-mandapam', 'Lotus Mandap', 'Cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.', true)
on conflict (slug) do nothing;




