-- ========================================================
-- AHVAANAM - AUTOMATED CLIENT ONBOARDING ADDITIVE MIGRATION
-- ========================================================
-- Execute this script in your Supabase Project SQL Editor:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- This additive migration adds dedicated tracking columns to the
-- existing invitations table for onboarding emails.
--
-- Note: The application also stores delivery status and timestamps
-- inside invitations.config->'onboarding_email', ensuring reliable
-- operation even if this migration has not yet been executed.

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS onboarding_email_sent_at timestamptz;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS onboarding_email_status text DEFAULT 'pending';

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS onboarding_email_recipient text;

ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS onboarding_email_error text;

-- Index to query onboarding delivery status efficiently
CREATE INDEX IF NOT EXISTS idx_invitations_onboarding_status 
ON public.invitations(onboarding_email_status);
