-- ================================================
-- LA'COURONNE SALON DATABASE SCHEMA
-- ================================================
-- Import this file into phpMyAdmin or MySQL CLI
-- Compatible with MySQL 5.7+ and MariaDB 10.3+
-- ================================================

-- Create the database
CREATE DATABASE IF NOT EXISTS couronne CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE couronne;

-- ================================================
-- SERVICES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('cut', 'color', 'treatment', 'styling', 'extensions', 'braids', 'twists', 'locs', 'mens', 'natural') NOT NULL,
  gender ENUM('female', 'male', 'both') NOT NULL DEFAULT 'both',
  duration_min INT NOT NULL DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- STAFF TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS staff (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  avatar VARCHAR(500),
  bio TEXT,
  working_hours JSON,
  services_offered JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- CLIENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  notes TEXT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- BOOKINGS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(50) PRIMARY KEY,
  client_id VARCHAR(50) NOT NULL,
  staff_id VARCHAR(50),
  services JSON,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no-show') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- SETTINGS TABLE (Single Row)
-- ================================================
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  name VARCHAR(255) DEFAULT 'La''Couronne',
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  whatsapp_number VARCHAR(50),
  instagram_handle VARCHAR(100),
  business_hours JSON,
  whatsapp_template TEXT,
  admin_pin VARCHAR(10) DEFAULT '67771',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- GALLERY TABLE (Optional - for image uploads)
-- ================================================
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(50) PRIMARY KEY,
  url VARCHAR(500) NOT NULL,
  category ENUM('women', 'men') NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- INDEXES FOR BETTER PERFORMANCE
-- ================================================
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(active);

-- ================================================
-- INSERT DEFAULT DATA
-- ================================================

-- Default Settings
INSERT INTO settings (id, name, address, phone, email, whatsapp_number, instagram_handle, business_hours, whatsapp_template, admin_pin)
VALUES (
  1,
  'La''Couronne',
  'North Cyprus',
  '+90 533 000 0000',
  'info@lacouronne.com',
  '905338709271',
  'lacouronne_hair',
  '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}',
  'Hello! I''d like to confirm my appointment:\n\nName: {clientName}\nService: {serviceName}\nDate: {date}\nTime: {time}\nBooking ID: {id}\n\nPlease confirm. Thank you!',
  '67771'
) ON DUPLICATE KEY UPDATE id=id;

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
ON DUPLICATE KEY UPDATE id=id;

-- Default Staff
INSERT INTO staff (id, name, title, avatar, bio, working_hours, services_offered) VALUES
('staff-1', 'Amara', 'Master Braider', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', 'Specialist in knotless braids and protective styles with 8+ years experience.', '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}', '["srv-1","srv-2","srv-3","srv-4","srv-5"]'),
('staff-2', 'Kwame', 'Mens Specialist', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Expert in fades, cornrows, and mens grooming.', '{"monday":null,"tuesday":{"start":"10:00","end":"19:00"},"wednesday":{"start":"10:00","end":"19:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}', '["srv-3","srv-6","srv-7"]'),
('staff-3', 'Fatima', 'Loc Technician', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', 'Certified loctician specializing in starter locs and maintenance.', '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":null,"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"16:00"},"sunday":null}', '["srv-5","srv-6","srv-8"]')
ON DUPLICATE KEY UPDATE id=id;

-- Sample Clients (Optional)
INSERT INTO clients (id, name, phone, email, notes, tags) VALUES
('client-1', 'Sarah Johnson', '+90 532 123 4567', 'sarah.j@email.com', 'Prefers knotless braids. Sensitive edges.', '["VIP","Regular"]'),
('client-2', 'Marcus Williams', '+90 533 234 5678', 'marcus.w@email.com', 'Regular customer for cornrows.', '["Regular"]')
ON DUPLICATE KEY UPDATE id=id;

-- ================================================
-- VERIFY INSTALLATION
-- ================================================
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) AS total_services FROM services;
SELECT COUNT(*) AS total_staff FROM staff;
SELECT COUNT(*) AS total_clients FROM clients;
SELECT name AS salon_name FROM settings WHERE id = 1;

