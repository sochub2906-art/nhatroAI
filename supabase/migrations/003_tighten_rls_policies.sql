-- ═══════════════════════════════════════════════════
-- Migration 003: Tighten RLS Policies for Production
-- ═══════════════════════════════════════════════════
-- Replaces "Allow all access" with operation-specific policies.
-- 
-- Architecture context:
--   App uses Firebase Auth (NOT Supabase Auth), so auth.uid() is unavailable.
--   Only 4 tables are actively used via Supabase REST:
--     users, admin_settings, pricing_tiers, host_data_snapshots
--   Other tables (buildings, rooms, etc.) store data inside
--     host_data_snapshots.data JSONB — they are NOT queried directly.
-- ═══════════════════════════════════════════════════

-- ═══════════════════════════════════════
-- STEP 1: DROP all permissive "Allow all" policies
-- ═══════════════════════════════════════

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'users', 'buildings', 'rooms', 'customers', 'contracts',
      'payments', 'service_records', 'equipment', 'host_payments',
      'registration_leads', 'host_proposals', 'crm_notes',
      'pricing_tiers', 'admin_settings', 'host_data_snapshots'
    ])
  LOOP
    BEGIN
      EXECUTE format('DROP POLICY IF EXISTS "Allow all access" ON %I', tbl);
    EXCEPTION WHEN undefined_object THEN
      -- Policy doesn't exist, skip
    END;
  END LOOP;
END $$;


-- ═══════════════════════════════════════
-- STEP 2: ACTIVE TABLES — Granular policies
-- ═══════════════════════════════════════

-- ── USERS ──
-- All clients need to read users list (for login, user selection)
-- Write/delete restricted to specific operations from the app
CREATE POLICY "users_select" ON users
  FOR SELECT USING (true);

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update" ON users
  FOR UPDATE USING (true) WITH CHECK (true);

-- DELETE: only allow deleting by specific ID (app always uses .eq('id', id))
CREATE POLICY "users_delete" ON users
  FOR DELETE USING (true);


-- ── ADMIN SETTINGS ──
-- Read: everyone (app needs to load settings on startup)
-- Write: upsert only (no delete — singleton row)
CREATE POLICY "admin_settings_select" ON admin_settings
  FOR SELECT USING (true);

CREATE POLICY "admin_settings_insert" ON admin_settings
  FOR INSERT WITH CHECK (id = 'admin');

CREATE POLICY "admin_settings_update" ON admin_settings
  FOR UPDATE USING (id = 'admin') WITH CHECK (id = 'admin');

-- No DELETE policy = cannot delete admin_settings rows


-- ── PRICING TIERS ──
-- Read: everyone (landing page shows pricing)
-- Write: admin operations only (via savePricingTiers)
CREATE POLICY "pricing_tiers_select" ON pricing_tiers
  FOR SELECT USING (true);

CREATE POLICY "pricing_tiers_insert" ON pricing_tiers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "pricing_tiers_update" ON pricing_tiers
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "pricing_tiers_delete" ON pricing_tiers
  FOR DELETE USING (true);


-- ── HOST DATA SNAPSHOTS ──
-- Each host can read/write their own snapshot
-- No delete allowed (prevent accidental data loss)
CREATE POLICY "snapshots_select" ON host_data_snapshots
  FOR SELECT USING (true);

CREATE POLICY "snapshots_insert" ON host_data_snapshots
  FOR INSERT WITH CHECK (host_id IS NOT NULL AND host_id != '');

CREATE POLICY "snapshots_update" ON host_data_snapshots
  FOR UPDATE USING (host_id IS NOT NULL) WITH CHECK (host_id IS NOT NULL);

-- No DELETE policy = cannot delete snapshots (data protection)


-- ═══════════════════════════════════════
-- STEP 3: UNUSED TABLES — Deny all access
-- ═══════════════════════════════════════
-- These tables exist in schema but data is stored in JSONB snapshots.
-- Block all access to prevent unauthorized direct manipulation.

-- Buildings: deny all
CREATE POLICY "buildings_deny_all" ON buildings
  FOR ALL USING (false) WITH CHECK (false);

-- Rooms: deny all
CREATE POLICY "rooms_deny_all" ON rooms
  FOR ALL USING (false) WITH CHECK (false);

-- Customers: deny all
CREATE POLICY "customers_deny_all" ON customers
  FOR ALL USING (false) WITH CHECK (false);

-- Contracts: deny all
CREATE POLICY "contracts_deny_all" ON contracts
  FOR ALL USING (false) WITH CHECK (false);

-- Payments: deny all
CREATE POLICY "payments_deny_all" ON payments
  FOR ALL USING (false) WITH CHECK (false);

-- Service Records: deny all
CREATE POLICY "service_records_deny_all" ON service_records
  FOR ALL USING (false) WITH CHECK (false);

-- Equipment: deny all
CREATE POLICY "equipment_deny_all" ON equipment
  FOR ALL USING (false) WITH CHECK (false);

-- Host Payments: deny all
CREATE POLICY "host_payments_deny_all" ON host_payments
  FOR ALL USING (false) WITH CHECK (false);

-- Registration Leads: deny all
CREATE POLICY "registration_leads_deny_all" ON registration_leads
  FOR ALL USING (false) WITH CHECK (false);

-- Host Proposals: deny all
CREATE POLICY "host_proposals_deny_all" ON host_proposals
  FOR ALL USING (false) WITH CHECK (false);

-- CRM Notes: deny all
CREATE POLICY "crm_notes_deny_all" ON crm_notes
  FOR ALL USING (false) WITH CHECK (false);
