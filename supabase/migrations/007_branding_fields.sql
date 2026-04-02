-- Add branding columns to admin_settings table
ALTER TABLE public.admin_settings 
  ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS favicon_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS company_info JSONB DEFAULT '{}';
