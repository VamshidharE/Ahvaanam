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

