-- ═══════════════════════════════════════════════════
-- Smart Rental Manager — Supabase Schema
-- Project: hrnklpdztppizpvivpmd
-- ═══════════════════════════════════════════════════

-- ═══ USERS & AUTH ═══
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN','SALES','HOST','TENANT')),
  avatar TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','pending','suspended')),
  subscription_plan_id TEXT,
  subscription_start_date DATE,
  subscription_end_date DATE,
  active_addons TEXT[] DEFAULT '{}',
  managed_building_ids TEXT[] DEFAULT '{}',
  google_sheet_id TEXT,
  google_sheet_url TEXT,
  linked_room_id TEXT,
  linked_contract_id TEXT,
  assigned_host_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ BUILDINGS ═══
CREATE TABLE IF NOT EXISTS buildings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT DEFAULT '',
  type TEXT DEFAULT 'Owned' CHECK (type IN ('Owned','Rented')),
  total_floors INT DEFAULT 1,
  host_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  rental_cost NUMERIC DEFAULT 0,
  lease_start_date DATE,
  lease_duration_months INT,
  lease_end_date DATE,
  warning_days INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ROOMS ═══
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  floor INT DEFAULT 1,
  status TEXT DEFAULT 'Trống' CHECK (status IN ('Đang ở','Trống','Đang sửa')),
  building_id TEXT REFERENCES buildings(id) ON DELETE CASCADE,
  position_x NUMERIC DEFAULT 0,
  position_y NUMERIC DEFAULT 0,
  host_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ CUSTOMERS ═══
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  zalo TEXT DEFAULT '',
  id_number TEXT,
  id_issue_date DATE,
  id_issue_place TEXT,
  id_front_image TEXT,
  id_back_image TEXT,
  avatar_image TEXT,
  host_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ CONTRACTS ═══
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
  customer_id TEXT REFERENCES customers(id) ON DELETE SET NULL,
  start_date DATE NOT NULL,
  duration_months INT DEFAULT 12,
  price NUMERIC DEFAULT 0,
  electric_price NUMERIC DEFAULT 0,
  water_price NUMERIC DEFAULT 0,
  internet_price NUMERIC DEFAULT 0,
  extra_services JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  end_date DATE,
  host_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ PAYMENTS ═══
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  contract_id TEXT REFERENCES contracts(id) ON DELETE CASCADE,
  amount NUMERIC DEFAULT 0,
  type TEXT DEFAULT '',
  period TEXT DEFAULT '',
  due_date DATE,
  status TEXT DEFAULT 'Chờ thanh toán'
    CHECK (status IN ('Chờ thanh toán','Đã đóng','Quá hạn')),
  paid_date DATE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ SERVICE RECORDS ═══
CREATE TABLE IF NOT EXISTS service_records (
  id TEXT PRIMARY KEY,
  room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  electric_usage NUMERIC DEFAULT 0,
  water_usage NUMERIC DEFAULT 0,
  internet_cost NUMERIC DEFAULT 0,
  other_cost NUMERIC DEFAULT 0,
  total_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ EQUIPMENT ═══
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'Tốt'
    CHECK (status IN ('Tốt','Hỏng','Đang sửa','Thanh lý')),
  building_id TEXT REFERENCES buildings(id) ON DELETE CASCADE,
  room_id TEXT,
  purchase_date DATE,
  price NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ HOST PAYMENTS ═══
CREATE TABLE IF NOT EXISTS host_payments (
  id TEXT PRIMARY KEY,
  host_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC DEFAULT 0,
  period TEXT DEFAULT '',
  due_date DATE,
  status TEXT DEFAULT 'Chờ thanh toán'
    CHECK (status IN ('Chờ thanh toán','Đã đóng','Quá hạn')),
  paid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ REGISTRATION LEADS ═══
CREATE TABLE IF NOT EXISTS registration_leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  needs TEXT DEFAULT '',
  assigned_sales_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new','contacted','converted','lost')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ HOST PROPOSALS ═══
CREATE TABLE IF NOT EXISTS host_proposals (
  id TEXT PRIMARY KEY,
  sales_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  host_name TEXT NOT NULL,
  address TEXT DEFAULT '',
  building_count INT DEFAULT 0,
  room_count INT DEFAULT 0,
  notes TEXT DEFAULT '',
  subscription_plan_id TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ CRM NOTES ═══
CREATE TABLE IF NOT EXISTS crm_notes (
  id TEXT PRIMARY KEY,
  host_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  author_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ PRICING TIERS ═══
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC DEFAULT 0,
  max_buildings INT DEFAULT 1,
  max_rooms INT DEFAULT 10,
  features TEXT[] DEFAULT '{}',
  feature_flags JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ ADMIN SETTINGS (singleton) ═══
CREATE TABLE IF NOT EXISTS admin_settings (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  admin_email TEXT DEFAULT '',
  sales_email TEXT DEFAULT '',
  google_sheet_webhook_url TEXT,
  landing_background_url TEXT,
  email_templates JSONB DEFAULT '{}',
  sales_team_emails TEXT[] DEFAULT '{}',
  payment_config JSONB DEFAULT '{}',
  addons JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_buildings_host ON buildings(host_id);
CREATE INDEX IF NOT EXISTS idx_rooms_building ON rooms(building_id);
CREATE INDEX IF NOT EXISTS idx_rooms_host ON rooms(host_id);
CREATE INDEX IF NOT EXISTS idx_customers_host ON customers(host_id);
CREATE INDEX IF NOT EXISTS idx_contracts_room ON contracts(room_id);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_host ON contracts(host_id);
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_service_records_room ON service_records(room_id);
CREATE INDEX IF NOT EXISTS idx_equipment_building ON equipment(building_id);
CREATE INDEX IF NOT EXISTS idx_host_payments_host ON host_payments(host_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON registration_leads(status);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON host_proposals(status);
CREATE INDEX IF NOT EXISTS idx_crm_notes_host ON crm_notes(host_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Permissive policies (tighten later as needed)
CREATE POLICY "Allow all access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON buildings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON service_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON equipment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON host_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON registration_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON host_proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON crm_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON pricing_tiers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access" ON admin_settings FOR ALL USING (true) WITH CHECK (true);

-- ═══════════════════════════════════════
-- ENABLE REALTIME
-- ═══════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_settings;
ALTER PUBLICATION supabase_realtime ADD TABLE pricing_tiers;
