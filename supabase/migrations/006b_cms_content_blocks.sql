-- ═══════════════════════════════════════════════════
-- Add content_blocks JSONB column for block-based CMS builder
-- ═══════════════════════════════════════════════════
ALTER TABLE public.cms_pages
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT '[]';
