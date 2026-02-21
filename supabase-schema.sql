-- ================================================
-- LA'COURONNE SALON - SUPABASE DATABASE SCHEMA
-- ================================================
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- SERVICES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY DEFAULT ('srv-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cut', 'color', 'treatment', 'styling', 'extensions', 'braids', 'twists', 'locs', 'mens', 'natural')),
  gender TEXT NOT NULL DEFAULT 'both' CHECK (gender IN ('female', 'male', 'both')),
  duration_min INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- STAFF TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY DEFAULT ('staff-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  title TEXT,
  avatar TEXT,
  bio TEXT,
  working_hours JSONB,
  services_offered JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- CLIENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY DEFAULT ('client-' || uuid_generate_v4()::text),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  tags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- BOOKINGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY DEFAULT ('book-' || uuid_generate_v4()::text),
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT REFERENCES staff(id) ON DELETE SET NULL,
  services JSONB DEFAULT '[]',
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SETTINGS TABLE (Single Row)
-- ================================================
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  name TEXT DEFAULT 'La''Couronne',
  address TEXT,
  phone TEXT,
  email TEXT,
  whatsapp_number TEXT,
  instagram_handle TEXT,
  business_hours JSONB,
  whatsapp_template TEXT,
  admin_pin TEXT DEFAULT '67771',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- GALLERY TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY DEFAULT ('img-' || uuid_generate_v4()::text),
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('women', 'men')),
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- AVAILABILITY TABLE (for available time slots)
-- ================================================
CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  time_slots JSONB DEFAULT '["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]',
  blocked_dates JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_gender ON services(gender);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================
-- Enable RLS but allow public access (for simplicity)
-- You can make this more restrictive later

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for all tables (simple setup)
-- For production, you should add authentication and restrict access

CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON services FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON services FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON staff FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON staff FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON staff FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON bookings FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON settings FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON gallery FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON gallery FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON availability FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON availability FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON availability FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON availability FOR DELETE USING (true);

-- ================================================
-- ENABLE REALTIME FOR BOOKINGS
-- ================================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;

-- ================================================
-- INSERT DEFAULT DATA
-- ================================================

-- Default Settings
INSERT INTO settings (id, name, address, phone, email, whatsapp_number, instagram_handle, business_hours, whatsapp_template, admin_pin)
VALUES (
  1,
  'La''Couronne',
  'North Cyprus - Famagusta, Iskele, Girne',
  '+90 533 000 0000',
  'info@lacouronne.com',
  '905338709271',
  'lacouronne_hair',
  '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}',
  'Hello! I''d like to confirm my appointment:\n\nName: {clientName}\nService: {serviceName}\nDate: {date}\nTime: {time}\nBooking ID: {id}\n\nPlease confirm. Thank you!',
  '67771'
) ON CONFLICT (id) DO NOTHING;

-- Default Availability
INSERT INTO availability (id, time_slots, blocked_dates)
VALUES (
  1,
  '["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]',
  '[]'
) ON CONFLICT (id) DO NOTHING;

-- Default Services
INSERT INTO services (id, name, category, gender, duration_min, price, description, active) VALUES
('srv-1', 'Box Braids', 'braids', 'female', 180, 2500.00, 'Classic box braids in various sizes - small, medium, or large. Perfect for any occasion.', TRUE),
('srv-2', 'Knotless Braids', 'braids', 'female', 240, 3500.00, 'Lightweight, tension-free braids that start flat at the root for a natural look.', TRUE),
('srv-3', 'Cornrows', 'braids', 'both', 120, 1500.00, 'Traditional African cornrow styles for men and women. Custom patterns available.', TRUE),
('srv-4', 'Fulani Braids', 'braids', 'female', 180, 2800.00, 'Beautiful tribal-inspired style with beads and accessories.', TRUE),
('srv-5', 'Twist Styles', 'twists', 'female', 150, 2000.00, 'Senegalese twists, passion twists, or marley twists - your choice!', TRUE),
('srv-6', 'Locs Maintenance', 'locs', 'both', 90, 1200.00, 'Retwisting, interlocking, and styling for mature locs.', TRUE),
('srv-7', 'Mens Cornrows', 'mens', 'male', 90, 1000.00, 'Sharp cornrow styles for men. Straight backs, designs, or freestyle.', TRUE),
('srv-8', 'Natural Hair Styling', 'natural', 'female', 60, 1000.00, 'Wash, condition, and style for natural curls and coils.', TRUE),
('srv-9', 'Fade Haircut', 'mens', 'male', 45, 800.00, 'Sharp fade cuts - low, mid, or high. Includes lineup and styling.', TRUE),
('srv-10', 'Mens Braids', 'braids', 'male', 90, 1200.00, 'Stylish braids for men - cornrows, two-strand twists, or box braids.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Default Staff
INSERT INTO staff (id, name, title, avatar, bio, working_hours, services_offered) VALUES
('staff-1', 'Amara', 'Master Braider', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', 'Specialist in knotless braids and protective styles with 8+ years experience.', '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}', '["srv-1","srv-2","srv-3","srv-4","srv-5"]'),
('staff-2', 'Kwame', 'Mens Specialist', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Expert in fades, cornrows, and mens grooming.', '{"monday":null,"tuesday":{"start":"10:00","end":"19:00"},"wednesday":{"start":"10:00","end":"19:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}', '["srv-3","srv-6","srv-7","srv-9","srv-10"]'),
('staff-3', 'Fatima', 'Loc Technician', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', 'Certified loctician specializing in starter locs and maintenance.', '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":null,"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"16:00"},"sunday":null}', '["srv-5","srv-6","srv-8"]')
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- VERIFY SETUP
-- ================================================
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS total_services FROM services;
SELECT COUNT(*) AS total_staff FROM staff;
SELECT name AS salon_name FROM settings WHERE id = 1;

