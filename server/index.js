import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { testConnection } from './db.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (config.cors.allowedOrigins.includes(origin) || config.server.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files in production
if (config.server.nodeEnv === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
}

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ============================================
// SERVICES ROUTES
// ============================================

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM services ORDER BY name');
    const services = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      gender: row.gender || 'both',
      durationMin: row.duration_min,
      price: parseFloat(row.price),
      description: row.description,
      active: Boolean(row.active),
    }));
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Create service
app.post('/api/services', async (req, res) => {
  try {
    const { name, category, gender, durationMin, price, description, active } = req.body;
    const id = generateId('srv');
    
    await pool.query(
      'INSERT INTO services (id, name, category, gender, duration_min, price, description, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, category, gender || 'both', durationMin, price, description, active ?? true]
    );
    
    res.json({ id, name, category, gender: gender || 'both', durationMin, price, description, active: active ?? true });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// Update service
app.put('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, gender, durationMin, price, description, active } = req.body;
    
    await pool.query(
      'UPDATE services SET name = ?, category = ?, gender = ?, duration_min = ?, price = ?, description = ?, active = ? WHERE id = ?',
      [name, category, gender || 'both', durationMin, price, description, active, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// Delete service
app.delete('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM services WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ============================================
// STAFF ROUTES
// ============================================

// Get all staff
app.get('/api/staff', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM staff ORDER BY name');
    const staff = rows.map(row => ({
      id: row.id,
      name: row.name,
      title: row.title,
      avatar: row.avatar,
      bio: row.bio,
      workingHours: typeof row.working_hours === 'string' ? JSON.parse(row.working_hours) : row.working_hours,
      servicesOffered: typeof row.services_offered === 'string' ? JSON.parse(row.services_offered) : row.services_offered,
    }));
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

// Create staff
app.post('/api/staff', async (req, res) => {
  try {
    const { name, title, avatar, bio, workingHours, servicesOffered } = req.body;
    const id = generateId('staff');
    
    await pool.query(
      'INSERT INTO staff (id, name, title, avatar, bio, working_hours, services_offered) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, title, avatar, bio, JSON.stringify(workingHours), JSON.stringify(servicesOffered)]
    );
    
    res.json({ id, name, title, avatar, bio, workingHours, servicesOffered });
  } catch (error) {
    console.error('Error creating staff:', error);
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

// Update staff
app.put('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, avatar, bio, workingHours, servicesOffered } = req.body;
    
    await pool.query(
      'UPDATE staff SET name = ?, title = ?, avatar = ?, bio = ?, working_hours = ?, services_offered = ? WHERE id = ?',
      [name, title, avatar, bio, JSON.stringify(workingHours), JSON.stringify(servicesOffered), id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).json({ error: 'Failed to update staff' });
  }
});

// Delete staff
app.delete('/api/staff/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM staff WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

// ============================================
// CLIENTS ROUTES
// ============================================

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clients ORDER BY name');
    const clients = rows.map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      notes: row.notes,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [],
      createdAt: row.created_at,
    }));
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create client
app.post('/api/clients', async (req, res) => {
  try {
    const { name, phone, email, notes, tags } = req.body;
    const id = generateId('client');
    
    await pool.query(
      'INSERT INTO clients (id, name, phone, email, notes, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name, phone, email || '', notes || '', JSON.stringify(tags || [])]
    );
    
    const [rows] = await pool.query('SELECT * FROM clients WHERE id = ?', [id]);
    const client = rows[0];
    
    res.json({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      notes: client.notes,
      tags: typeof client.tags === 'string' ? JSON.parse(client.tags) : client.tags || [],
      createdAt: client.created_at,
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, notes, tags } = req.body;
    
    await pool.query(
      'UPDATE clients SET name = ?, phone = ?, email = ?, notes = ?, tags = ? WHERE id = ?',
      [name, phone, email, notes, JSON.stringify(tags || []), id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

// ============================================
// BOOKINGS ROUTES
// ============================================

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bookings ORDER BY date DESC, start_time ASC');
    const bookings = rows.map(row => ({
      id: row.id,
      clientId: row.client_id,
      staffId: row.staff_id,
      services: typeof row.services === 'string' ? JSON.parse(row.services) : row.services || [],
      date: row.date instanceof Date ? row.date.toISOString().split('T')[0] : row.date,
      startTime: row.start_time,
      endTime: row.end_time,
      status: row.status,
      notes: row.notes,
      createdAt: row.created_at,
    }));
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { clientId, staffId, services, date, startTime, endTime, status, notes } = req.body;
    const id = generateId('book');
    
    await pool.query(
      'INSERT INTO bookings (id, client_id, staff_id, services, date, start_time, end_time, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, clientId, staffId || null, JSON.stringify(services || []), date, startTime, endTime, status || 'pending', notes || '']
    );
    
    res.json({
      id,
      clientId,
      staffId,
      services: services || [],
      date,
      startTime,
      endTime,
      status: status || 'pending',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, staffId, services, date, startTime, endTime, status, notes } = req.body;
    
    await pool.query(
      'UPDATE bookings SET client_id = ?, staff_id = ?, services = ?, date = ?, start_time = ?, end_time = ?, status = ?, notes = ? WHERE id = ?',
      [clientId, staffId || null, JSON.stringify(services || []), date, startTime, endTime, status, notes, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Update booking status
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// ============================================
// SETTINGS ROUTES
// ============================================

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    
    if (rows.length === 0) {
      return res.json(null);
    }
    
    const row = rows[0];
    res.json({
      name: row.name,
      address: row.address,
      phone: row.phone,
      email: row.email,
      whatsappNumber: row.whatsapp_number,
      instagramHandle: row.instagram_handle,
      businessHours: typeof row.business_hours === 'string' ? JSON.parse(row.business_hours) : row.business_hours,
      whatsappTemplate: row.whatsapp_template,
      adminPin: row.admin_pin,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
app.put('/api/settings', async (req, res) => {
  try {
    const { name, address, phone, email, whatsappNumber, instagramHandle, businessHours, whatsappTemplate, adminPin } = req.body;
    
    await pool.query(
      `UPDATE settings SET 
        name = ?, address = ?, phone = ?, email = ?, 
        whatsapp_number = ?, instagram_handle = ?, 
        business_hours = ?, whatsapp_template = ?, admin_pin = ?
       WHERE id = 1`,
      [name, address, phone, email, whatsappNumber, instagramHandle, JSON.stringify(businessHours), whatsappTemplate, adminPin]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// ============================================
// GALLERY ROUTES
// ============================================

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY created_at DESC');
    const gallery = rows.map(row => ({
      id: row.id,
      url: row.url,
      category: row.category,
      caption: row.caption,
      createdAt: row.created_at,
    }));
    res.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Add gallery image
app.post('/api/gallery', async (req, res) => {
  try {
    const { url, category, caption } = req.body;
    const id = generateId('img');
    
    await pool.query(
      'INSERT INTO gallery (id, url, category, caption) VALUES (?, ?, ?, ?)',
      [id, url, category, caption || '']
    );
    
    res.json({ id, url, category, caption: caption || '', createdAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ error: 'Failed to add gallery image' });
  }
});

// Delete gallery image
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM gallery WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// ============================================
// AUTH ROUTES
// ============================================

// Verify admin PIN
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { pin } = req.body;
    const [rows] = await pool.query('SELECT admin_pin FROM settings WHERE id = 1');
    
    if (rows.length === 0) {
      return res.json({ valid: pin === '67771' }); // Default PIN
    }
    
    res.json({ valid: rows[0].admin_pin === pin });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    res.status(500).json({ error: 'Failed to verify PIN' });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({ 
    status: 'ok', 
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// Serve frontend for all other routes (SPA support)
if (config.server.nodeEnv === 'production') {
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(config.server.port, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://localhost:${config.server.port}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`📋 API endpoints:`);
  console.log(`   GET    /api/services`);
  console.log(`   GET    /api/staff`);
  console.log(`   GET    /api/clients`);
  console.log(`   GET    /api/bookings`);
  console.log(`   GET    /api/settings`);
  console.log(`   GET    /api/health`);
  if (config.server.nodeEnv === 'production') {
    console.log(`📁 Serving static files from: ../dist`);
  }
  testConnection();
});



