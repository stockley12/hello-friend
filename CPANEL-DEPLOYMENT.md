# La'Couronne - cPanel Deployment Guide

Deploy your salon app to any web hosting with cPanel (Hostinger, Bluehost, Namecheap, GoDaddy, etc.)

---

## 📋 What You Need

- cPanel hosting account with:
  - Node.js support (or use static hosting + external API)
  - MySQL database
  - phpMyAdmin access
- Domain name (or use hosting subdomain)
- FTP client (FileZilla) or cPanel File Manager

---

## 🗂️ Deployment Options

### Option A: Static Frontend + Separate Backend API
Best for: Shared hosting without Node.js

### Option B: Full Node.js Deployment  
Best for: VPS or hosting with Node.js support

---

# Option A: Static Frontend Deployment

## Step 1: Build the Frontend

On your local computer:

```bash
cd /home/anon/Desktop/couronne/hello-world-project

# Create production .env
echo "VITE_API_URL=https://api.yourdomain.com/api" > .env

# Build for production
npm run build
```

This creates a `dist/` folder with your static files.

## Step 2: Create MySQL Database in cPanel

1. Login to your **cPanel**
2. Find **MySQL® Databases** (or MySQL Database Wizard)
3. Create new database:
   - Database name: `youruser_couronne`
   - Click **Create Database**

4. Create database user:
   - Username: `youruser_salon`
   - Password: (generate strong password, save it!)
   - Click **Create User**

5. Add user to database:
   - Select user and database
   - Check **ALL PRIVILEGES**
   - Click **Add**

**Note your credentials:**
```
Database: youruser_couronne
Username: youruser_salon
Password: your_password_here
Host: localhost
```

## Step 3: Import Database Schema

1. In cPanel, open **phpMyAdmin**
2. Click your database name on the left (`youruser_couronne`)
3. Click **Import** tab
4. Click **Choose File**
5. Select: `server/database-schema.sql`
6. Click **Go**
7. Verify tables appear: bookings, clients, gallery, services, settings, staff

## Step 4: Upload Frontend Files

### Using cPanel File Manager:

1. Open **File Manager** in cPanel
2. Navigate to `public_html` (or your domain folder)
3. Delete any existing files (index.html, etc.)
4. Click **Upload**
5. Upload ALL contents from your local `dist/` folder:
   - `index.html`
   - `assets/` folder
   - `manifest.json`
   - All other files

### Using FTP (FileZilla):

1. Connect to your hosting via FTP
2. Navigate to `public_html`
3. Upload all files from `dist/` folder

## Step 5: Configure .htaccess for React Router

Create `.htaccess` file in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType video/mp4 "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

## Step 6: Deploy Backend API

For the backend, you have options:

### Option 6A: Use Railway/Render (Free)

1. Go to https://railway.app or https://render.com
2. Connect your GitHub repo (push server folder)
3. Add environment variables:
   ```
   PORT=3001
   NODE_ENV=production
   DB_HOST=your-cpanel-mysql-host
   DB_PORT=3306
   DB_USER=youruser_salon
   DB_PASSWORD=your_password
   DB_NAME=youruser_couronne
   FRONTEND_URL=https://yourdomain.com
   ```
4. Deploy and get your API URL
5. Update frontend `.env` with this URL and rebuild

### Option 6B: Use cPanel Node.js (if available)

1. In cPanel, find **Setup Node.js App**
2. Create new application:
   - Node version: 18+
   - Application mode: Production
   - Application root: server
   - Application URL: api.yourdomain.com
3. Upload server files
4. Set environment variables
5. Run npm install
6. Start application

---

# Option B: Full Deployment (VPS with Node.js)

If your hosting supports Node.js:

## Step 1: Upload All Files

Upload entire `hello-world-project` folder to your server.

## Step 2: SSH into Server

```bash
ssh username@yourdomain.com
cd public_html/hello-world-project
```

## Step 3: Install & Build

```bash
# Install frontend deps and build
npm install
npm run build

# Install server deps
cd server
npm install
```

## Step 4: Configure Environment

Create `server/.env`:
```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=youruser_salon
DB_PASSWORD=your_password
DB_NAME=youruser_couronne
FRONTEND_URL=https://yourdomain.com
```

## Step 5: Start with PM2

```bash
npm install -g pm2
cd server
pm2 start index.js --name couronne-api
pm2 save
pm2 startup
```

## Step 6: Configure Nginx/Apache

Point your domain to the Node.js app or use reverse proxy.

---

## 🔧 Environment Variables Reference

### Frontend (.env in project root before building)

```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend (server/.env)

```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=youruser_salon
DB_PASSWORD=your_secure_password
DB_NAME=youruser_couronne
FRONTEND_URL=https://yourdomain.com
ADMIN_PIN=your_secure_pin
```

---

## 📱 After Deployment Checklist

- [ ] Frontend loads at yourdomain.com
- [ ] API responds at api.yourdomain.com/api/health
- [ ] Database has all tables
- [ ] Admin login works (/admin)
- [ ] Booking form submits successfully
- [ ] Change default admin PIN!
- [ ] Update salon settings (address, phone, etc.)

---

## 🐛 Troubleshooting

### "404 Not Found" on page refresh
→ `.htaccess` file missing or incorrect

### "CORS error"
→ Update `FRONTEND_URL` in server `.env`

### "Database connection failed"
→ Check cPanel MySQL credentials
→ Some hosts require specific hostname (not localhost)

### "Mixed content" warning
→ Ensure both frontend and API use HTTPS

### API not accessible
→ Check if your hosting allows outbound connections
→ May need to whitelist API server IP

---

## 📞 Common cPanel MySQL Hosts

| Provider | MySQL Host |
|----------|-----------|
| Hostinger | `localhost` or MySQL hostname in cPanel |
| Bluehost | `localhost` |
| Namecheap | `localhost` |
| GoDaddy | Check cPanel for specific host |
| SiteGround | `localhost` |

---

## 🔐 Security Reminders

1. Use strong database password
2. Change default admin PIN (1234)
3. Enable HTTPS/SSL on your domain
4. Don't commit `.env` files to git
5. Regularly backup your database







