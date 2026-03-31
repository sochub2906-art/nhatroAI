-- ═══════════════════════════════════════════════════
-- Create missing table: host_data_snapshots
-- ═══════════════════════════════════════════════════
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/brmhrzyiaknppzqbwwpv/sql/new

CREATE TABLE IF NOT EXISTS public.host_data_snapshots (
    host_id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source TEXT DEFAULT 'app'
);

-- Enable Row Level Security
ALTER TABLE public.host_data_snapshots ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read/write (matches your anon key pattern)
CREATE POLICY "Allow all access to host_data_snapshots"
    ON public.host_data_snapshots
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.host_data_snapshots TO anon;
GRANT ALL ON public.host_data_snapshots TO authenticated;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_host_data_snapshots_updated 
    ON public.host_data_snapshots(updated_at DESC);

-- Enable realtime (optional, if you want live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.host_data_snapshots;
