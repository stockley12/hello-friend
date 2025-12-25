# La'Couronne - Hostinger Deployment Guide

Complete step-by-step guide to deploy your salon app on Hostinger.

---

## 📋 Prerequisites

- Hostinger hosting account (Business or higher for Node.js)
- Domain name connected to Hostinger
- Your project files ready

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      HOSTINGER                          │
│  ┌─────────────────┐       ┌─────────────────────────┐  │
│  │   Frontend      │       │      MySQL Database     │  │
│  │   (Static)      │       │      (phpMyAdmin)       │  │
│  │   public_html/  │       │                         │  │
│  └────────┬────────┘       └────────────┬────────────┘  │
│           │                             │               │
│           └──────────┬──────────────────┘               │
│                      │                                  │
│           ┌──────────▼──────────┐                       │
│           │   Node.js Backend   │                       │
│           │   (API Server)      │                       │
│           └─────────────────────┘                       │
└─────────────────────────────────────────────────────────┘
```

---

# STEP 1: Create MySQL Database

## 1.1 Login to Hostinger

1. Go to https://www.hostinger.com
2. Login to your account
3. Click **Manage** on your hosting plan

## 1.2 Create Database

1. In hPanel, find **Databases** section
2. Click **MySQL Databases**
3. Fill in:
   - **Database name:** `couronne`
   - **Username:** `couronne_user`
   - **Password:** (click Generate or create strong password)
4. Click **Create**

📝 **SAVE THESE CREDENTIALS:**
```
Database Name: u123456789_couronne
Username: u123456789_couronne_user
Password: YourGeneratedPassword
Host: localhost (or check hPanel for specific host)
```

---

# STEP 2: Import Database Schema

## 2.1 Open phpMyAdmin

1. In hPanel, click **phpMyAdmin** (under Databases)
2. Click **Enter phpMyAdmin**
3. Select your database from the left sidebar

## 2.2 Import Schema

1. Click **Import** tab at the top
2. Click **Choose File**
3. Select: `server/database-schema.sql` from your computer
4. Scroll down and click **Go**
5. Wait for "Import has been successfully finished"

## 2.3 Verify Tables

Click your database name. You should see:
- ✅ bookings
- ✅ clients
- ✅ gallery
- ✅ services (with 8 default services)
- ✅ settings (with default config)
- ✅ staff (with 3 default staff)

---

# STEP 3: Set Up Node.js Backend

## Option A: Hostinger Node.js (if available on your plan)

### 3A.1 Enable Node.js

1. In hPanel, find **Advanced** section
2. Click **Node.js**
3. Click **Create Application**
4. Configure:
   - **Node.js version:** 18.x or 20.x
   - **Application root:** `server`
   - **Application URL:** `api.yourdomain.com` or `yourdomain.com/api`
   - **Startup file:** `index.js`

### 3A.2 Upload Server Files

1. In hPanel, open **File Manager**
2. Navigate to your Node.js application root
3. Upload these files from `server/` folder:
   - `index.js`
   - `config.js`
   - `db.js`
   - `package.json`
   - `package-lock.json`

### 3A.3 Create Environment File

1. In File Manager, create new file: `.env`
2. Add this content (update with YOUR credentials):

```env
PORT=3000
NODE_ENV=production

DB_HOST=localhost
DB_PORT=3306
DB_USER=u123456789_couronne_user
DB_PASSWORD=YourPasswordHere
DB_NAME=u123456789_couronne

FRONTEND_URL=https://yourdomain.com
ADMIN_PIN=YourSecurePIN
```

### 3A.4 Install Dependencies

1. In Node.js settings, click **Run NPM Install**
2. Or use SSH:
```bash
cd ~/domains/yourdomain.com/server
npm install
```

### 3A.5 Start Application

1. In Node.js settings, click **Restart**
2. Check if running (green status)

---

## Option B: Use External Backend (Railway - FREE)

If Hostinger doesn't support Node.js on your plan:

### 3B.1 Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub

### 3B.2 Deploy Backend

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Connect your repo or upload manually
4. Select the `server` folder

### 3B.3 Add MySQL Plugin

1. In Railway dashboard, click **+ New**
2. Select **Database** → **MySQL**
3. Railway will create a MySQL database for you

### 3B.4 Configure Environment Variables

In Railway, go to **Variables** tab and add:

```
PORT=3001
NODE_ENV=production
DB_HOST=(from Railway MySQL)
DB_PORT=(from Railway MySQL)
DB_USER=(from Railway MySQL)
DB_PASSWORD=(from Railway MySQL)
DB_NAME=(from Railway MySQL)
FRONTEND_URL=https://yourdomain.com
ADMIN_PIN=YourSecurePIN
```

Or connect to your Hostinger MySQL:
```
DB_HOST=your-hostinger-mysql-host
DB_USER=u123456789_couronne_user
DB_PASSWORD=YourPasswordHere
DB_NAME=u123456789_couronne
```

### 3B.5 Get API URL

After deployment, Railway gives you a URL like:
```
https://couronne-api-production.up.railway.app
```

Save this for Step 4!

---

# STEP 4: Build Frontend

## 4.1 Configure API URL

On your local computer, create `.env` file in project root:

**If using Hostinger Node.js:**
```env
VITE_API_URL=https://yourdomain.com/api
```

**If using Railway:**
```env
VITE_API_URL=https://your-railway-url.up.railway.app/api
```

## 4.2 Build Production Files

```bash
cd /home/anon/Desktop/couronne/hello-world-project
npm install
npm run build
```

This creates a `dist/` folder with all your static files.

## 4.3 Verify Build

Check `dist/` folder contains:
- `index.html`
- `assets/` folder (JS, CSS, images)
- `manifest.json`
- Other files

---

# STEP 5: Upload Frontend to Hostinger

## 5.1 Open File Manager

1. In hPanel, click **File Manager**
2. Navigate to `public_html` folder
3. Delete existing files (if any default files exist)

## 5.2 Upload Files

### Method A: File Manager Upload

1. Click **Upload** button
2. Select ALL files from your local `dist/` folder
3. Wait for upload to complete

### Method B: FTP Upload (Faster for many files)

1. In hPanel, go to **FTP Accounts**
2. Get your FTP credentials
3. Use FileZilla:
   - Host: `ftp.yourdomain.com`
   - Username: your FTP username
   - Password: your FTP password
   - Port: 21
4. Upload `dist/` contents to `public_html/`

## 5.3 Upload .htaccess

Make sure `.htaccess` file is in `public_html/`:

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

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

Options -Indexes
```

---

# STEP 6: Enable SSL (HTTPS)

## 6.1 Get Free SSL

1. In hPanel, go to **SSL**
2. Click **Setup** on Free SSL
3. Select your domain
4. Click **Install**
5. Wait for installation (may take 10-30 minutes)

## 6.2 Force HTTPS

Add to your `.htaccess`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

# STEP 7: Test Your Deployment

## 7.1 Test Frontend

Open: `https://yourdomain.com`

- [ ] Homepage loads
- [ ] Images display correctly
- [ ] Navigation works
- [ ] No console errors

## 7.2 Test API

Open: `https://yourdomain.com/api/health` (or your Railway URL)

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

## 7.3 Test Full Flow

- [ ] Go to `/book` - booking form loads
- [ ] Go to `/admin` - login page shows
- [ ] Enter PIN (default: 1234) - dashboard loads
- [ ] Create a test booking

---

# STEP 8: Final Configuration

## 8.1 Update Salon Settings

1. Login to admin panel: `https://yourdomain.com/admin`
2. Go to **Settings**
3. Update:
   - Salon name
   - Address
   - Phone number
   - WhatsApp number
   - Instagram handle
   - Business hours

## 8.2 Change Admin PIN

⚠️ **IMPORTANT:** Change the default PIN!

1. Go to Admin Settings
2. Change PIN from `1234` to something secure

## 8.3 Add Your Services

1. Go to Admin → Services
2. Edit/add your actual services with real prices

---

# 📁 Summary: Files to Upload

## To `public_html/` (Frontend)
```
public_html/
├── index.html
├── .htaccess
├── manifest.json
├── favicon.ico
├── robots.txt
├── sw.js
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── (all asset files)
├── icons/
├── videos/
└── (other static files)
```

## To Node.js folder (Backend) - if using Hostinger Node.js
```
server/
├── index.js
├── config.js
├── db.js
├── package.json
├── package-lock.json
└── .env
```

---

# 🐛 Troubleshooting

### "404 Not Found" on page refresh
→ `.htaccess` file missing or not uploaded

### "CORS error" in browser console
→ Update `FRONTEND_URL` in backend `.env` to match your domain exactly

### "Database connection failed"
→ Check MySQL credentials in `.env`
→ Hostinger may use different host than `localhost`

### API returns errors
→ Check Node.js application logs in hPanel
→ Verify database tables exist in phpMyAdmin

### Images not loading
→ Check file paths are correct
→ Verify files uploaded to correct location

### SSL not working
→ Wait 30 minutes after SSL installation
→ Clear browser cache

---

# 📞 Hostinger MySQL Host

If `localhost` doesn't work, find your MySQL host:
1. Go to hPanel → MySQL Databases
2. Look for "MySQL Hostname" or similar
3. Use that in your `.env` file

Common formats:
- `localhost`
- `mysql.hostinger.com`
- `sql123.main-hosting.eu`

---

# ✅ Deployment Checklist

- [ ] MySQL database created on Hostinger
- [ ] Database schema imported via phpMyAdmin
- [ ] Backend deployed (Hostinger Node.js or Railway)
- [ ] Backend .env configured with correct credentials
- [ ] Frontend built with correct API URL
- [ ] Frontend files uploaded to public_html
- [ ] .htaccess file uploaded
- [ ] SSL certificate installed
- [ ] Website accessible via HTTPS
- [ ] API health check returns "connected"
- [ ] Admin login works
- [ ] Default PIN changed
- [ ] Salon settings updated








