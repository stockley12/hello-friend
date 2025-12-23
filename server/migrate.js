import mysql from 'mysql2/promise';
import { config } from './config.js';

const schema = `
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS ${config.db.database};
USE ${config.db.database};

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('cut', 'color', 'treatment', 'styling', 'extensions', 'braids', 'twists', 'locs', 'mens', 'natural') NOT NULL,
  duration_min INT NOT NULL DEFAULT 30,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Staff table
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
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  notes TEXT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings table
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
);

-- Settings table (single row)
CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY DEFAULT 1,
  name VARCHAR(255) DEFAULT "La'Couronne",
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  whatsapp_number VARCHAR(50),
  instagram_handle VARCHAR(100),
  business_hours JSON,
  whatsapp_template TEXT,
  admin_pin VARCHAR(10) DEFAULT '1234',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings if not exists
INSERT IGNORE INTO settings (id, name, address, phone, email, whatsapp_number, instagram_handle, business_hours, whatsapp_template, admin_pin)
VALUES (
  1,
  "La'Couronne",
  'Nişantaşı, İstanbul',
  '+90 212 555 0100',
  'info@lacouronne.com',
  '905325550100',
  'lcouronne',
  '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}',
  'Hello! I''d like to confirm my appointment:\\n\\nName: {clientName}\\nService: {serviceName}\\nDate: {date}\\nTime: {time}\\nBooking ID: {id}\\n\\nPlease confirm. Thank you!',
  '1234'
);

-- Insert default services
INSERT IGNORE INTO services (id, name, category, duration_min, price, description, active) VALUES
('srv-1', 'Box Braids', 'braids', 180, 2500.00, 'Classic box braids in various sizes - small, medium, or large. Perfect for any occasion.', TRUE),
('srv-2', 'Knotless Braids', 'braids', 240, 3500.00, 'Lightweight, tension-free braids that start flat at the root for a natural look.', TRUE),
('srv-3', 'Cornrows', 'braids', 120, 1500.00, 'Traditional African cornrow styles for men and women. Custom patterns available.', TRUE),
('srv-4', 'Fulani Braids', 'braids', 180, 2800.00, 'Beautiful tribal-inspired style with beads and accessories.', TRUE),
('srv-5', 'Twist Styles', 'twists', 150, 2000.00, 'Senegalese twists, passion twists, or marley twists - your choice!', TRUE),
('srv-6', 'Locs Maintenance', 'locs', 90, 1200.00, 'Retwisting, interlocking, and styling for mature locs.', TRUE),
('srv-8', 'Natural Hair Styling', 'natural', 60, 1000.00, 'Wash, condition, and style for natural curls and coils.', TRUE);

-- Insert default staff
INSERT IGNORE INTO staff (id, name, title, avatar, bio, working_hours, services_offered) VALUES
('staff-1', 'Amara', 'Master Braider', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face', 'Specialist in knotless braids and protective styles with 8+ years experience.', '{"monday":{"start":"09:00","end":"18:00"},"tuesday":{"start":"09:00","end":"18:00"},"wednesday":{"start":"09:00","end":"18:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}', '["srv-1","srv-2","srv-3","srv-4","srv-5"]'),
('staff-2', 'Kwame', 'Mens Specialist', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'Expert in fades, cornrows, and mens grooming.', '{"monday":null,"tuesday":{"start":"10:00","end":"19:00"},"wednesday":{"start":"10:00","end":"19:00"},"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"17:00"},"sunday":null}', '["srv-3","srv-6"]'),
('staff-3', 'Fatima', 'Loc Technician', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', 'Certified loctician specializing in starter locs and maintenance.', '{"monday":{"start":"09:00","end":"17:00"},"tuesday":{"start":"09:00","end":"17:00"},"wednesday":null,"thursday":{"start":"10:00","end":"19:00"},"friday":{"start":"10:00","end":"19:00"},"saturday":{"start":"09:00","end":"16:00"},"sunday":null}', '["srv-5","srv-6","srv-8"]');

-- Insert sample clients
INSERT IGNORE INTO clients (id, name, phone, email, notes, tags) VALUES
('client-1', 'Sarah Johnson', '+90 532 123 4567', 'sarah.j@email.com', 'Prefers knotless braids. Sensitive edges.', '["VIP","Regular"]'),
('client-2', 'Marcus Williams', '+90 533 234 5678', 'marcus.w@email.com', 'Regular customer for fades.', '["Regular"]');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_client ON bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_clients_phone ON clients(phone);
`;

async function migrate() {
  console.log('🚀 Starting database migration...');
  
  // Connect without database first to create it
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    // Run migrations
    await connection.query(schema);
    console.log('✅ Migration completed successfully!');
    console.log('📋 Created tables: services, staff, clients, bookings, settings');
    console.log('📦 Inserted default data');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

migrate().catch(console.error);



