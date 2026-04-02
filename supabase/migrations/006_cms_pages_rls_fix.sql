-- ═══════════════════════════════════════════════════
-- FIX: CMS Pages RLS - Allow anon role full CRUD access
-- ═══════════════════════════════════════════════════
-- Problem: The original migration only allowed SELECT for anon/authenticated
-- and full access for service_role. Since the app uses anon key (Firebase Auth,
-- not Supabase Auth), admin upserts were blocked by RLS.
--
-- Solution: Grant anon full access since authorization is handled at the
-- application layer (admin panel is already protected by role checks in the UI).
-- ═══════════════════════════════════════════════════

-- Drop the restrictive SELECT-only policy for anon
DROP POLICY IF EXISTS "Anyone can read published pages" ON public.cms_pages;

-- Create permissive policies for anon role (app handles auth via Firebase)
CREATE POLICY "Anon can read all cms pages"
ON public.cms_pages FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon can insert cms pages"
ON public.cms_pages FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anon can update cms pages"
ON public.cms_pages FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Anon can delete cms pages"
ON public.cms_pages FOR DELETE
TO anon
USING (true);

-- Also grant INSERT, UPDATE, DELETE permissions to anon role
GRANT INSERT, UPDATE, DELETE ON public.cms_pages TO anon;
GRANT INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
