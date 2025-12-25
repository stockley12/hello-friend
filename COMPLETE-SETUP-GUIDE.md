# La'Couronne Complete Setup Guide

A step-by-step guide to set up the La'Couronne salon app from scratch.

---

## 📋 Table of Contents

1. [Install Required Software](#step-1-install-required-software)
2. [Start XAMPP Database](#step-2-start-xampp-database)
3. [Import Database Schema](#step-3-import-database-schema)
4. [Configure Backend Server](#step-4-configure-backend-server)
5. [Start the Backend](#step-5-start-the-backend)
6. [Start the Frontend](#step-6-start-the-frontend)
7. [Test Everything](#step-7-test-everything)
8. [Access Your App](#step-8-access-your-app)

---

## Step 1: Install Required Software

### A) Install XAMPP (Database)

**Windows:**
1. Download from: https://www.apachefriends.org/download.html
2. Run installer → Next → Next → Install
3. Launch XAMPP Control Panel

**Linux:**
```bash
# Download and install
wget https://sourceforge.net/projects/xampp/files/XAMPP%20Linux/8.2.12/xampp-linux-x64-8.2.12-0-installer.run
chmod +x xampp-linux-x64-8.2.12-0-installer.run
sudo ./xampp-linux-x64-8.2.12-0-installer.run
```

**Mac:**
1. Download from: https://www.apachefriends.org/download.html
2. Open DMG and drag to Applications
3. Open XAMPP from Applications

### B) Install Node.js

**All platforms:**
1. Download from: https://nodejs.org/ (LTS version)
2. Run installer → Next → Next → Install
3. Verify installation:
```bash
node --version   # Should show v18+ or v20+
npm --version    # Should show 9+ or 10+
```

---

## Step 2: Start XAMPP Database

### Windows:
1. Open **XAMPP Control Panel** (from Start menu)
2. Click **Start** next to **Apache**
3. Click **Start** next to **MySQL**
4. Both should turn **green**

### Linux:
```bash
sudo /opt/lampp/lampp start
```

### Mac:
1. Open **XAMPP** from Applications
2. Go to **Manage Servers** tab
3. Start **MySQL Database**
4. Start **Apache Web Server**

### ✅ Verify:
- Open browser: http://localhost/phpmyadmin
- You should see phpMyAdmin dashboard

---

## Step 3: Import Database Schema

### Option A: Using phpMyAdmin (Easiest)

1. Open http://localhost/phpmyadmin in your browser

2. Click **Import** in the top menu

3. Click **Choose File** button

4. Navigate to and select:
   ```
   /home/anon/Desktop/couronne/hello-world-project/server/database-schema.sql
   ```
   
   **Windows path:**
   ```
   C:\Users\YourName\Desktop\couronne\hello-world-project\server\database-schema.sql
   ```

5. Scroll down and click **Go**

6. Wait for "Import has been successfully finished" message

7. Click **couronne** database on the left sidebar to verify tables exist:
   - ✅ bookings
   - ✅ clients
   - ✅ gallery
   - ✅ services
   - ✅ settings
   - ✅ staff

### Option B: Using Command Line

**Windows (from XAMPP folder):**
```cmd
cd C:\xampp\mysql\bin
mysql -u root < "C:\path\to\hello-world-project\server\database-schema.sql"
```

**Linux/Mac:**
```bash
/opt/lampp/bin/mysql -u root < /home/anon/Desktop/couronne/hello-world-project/server/database-schema.sql
```

---

## Step 4: Configure Backend Server

### 4.1 Navigate to Server Folder

```bash
cd /home/anon/Desktop/couronne/hello-world-project/server
```

**Windows:**
```cmd
cd C:\Users\YourName\Desktop\couronne\hello-world-project\server
```

### 4.2 Create Environment File

**Linux/Mac:**
```bash
cp env.example.txt .env
```

**Windows (Command Prompt):**
```cmd
copy env.example.txt .env
```

**Or manually create** a file named `.env` in the `server` folder

### 4.3 Edit .env File

Open `.env` in any text editor and paste this:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration (XAMPP defaults)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=couronne

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8080

# Admin PIN (change this!)
ADMIN_PIN=1234
```

⚠️ **Important:** XAMPP default has NO password, so leave `DB_PASSWORD=` empty

### 4.4 Install Backend Dependencies

```bash
npm install
```

Wait for installation to complete (may take 1-2 minutes)

---

## Step 5: Start the Backend

In the `server` folder, run:

```bash
npm start
```

### ✅ Success Output:
```
🚀 Server running on http://localhost:3001
🌍 Environment: development
📋 API endpoints:
   GET    /api/services
   GET    /api/staff
   GET    /api/clients
   GET    /api/bookings
   GET    /api/settings
   GET    /api/health
✅ MySQL connected successfully
```

### ❌ If you see "MySQL connection failed":
1. Check XAMPP - MySQL must be running (green)
2. Verify database `couronne` exists in phpMyAdmin
3. Check `.env` credentials match (usually root with no password)

**Keep this terminal open!** The server needs to stay running.

---

## Step 6: Start the Frontend

### 6.1 Open NEW Terminal Window

Don't close the backend terminal! Open a new one.

### 6.2 Navigate to Project Root

```bash
cd /home/anon/Desktop/couronne/hello-world-project
```

**Windows:**
```cmd
cd C:\Users\YourName\Desktop\couronne\hello-world-project
```

### 6.3 Create Frontend Environment File

Create a file named `.env` in the project root (not in server folder):

```env
VITE_API_URL=http://localhost:3001/api
```

### 6.4 Install Frontend Dependencies (if not done)

```bash
npm install
```

### 6.5 Start Frontend Dev Server

```bash
npm run dev
```

### ✅ Success Output:
```
  VITE v5.4.19  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
```

---

## Step 7: Test Everything

### 7.1 Test Backend API

Open browser: http://localhost:3001/api/health

**Expected response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-12-19T..."
}
```

### 7.2 Test Services API

Open: http://localhost:3001/api/services

**Expected:** JSON array of salon services

### 7.3 Test Frontend

Open: http://localhost:8080

You should see the La'Couronne salon website!

---

## Step 8: Access Your App

### User-Facing Pages:
| Page | URL |
|------|-----|
| Home | http://localhost:8080/ |
| Services | http://localhost:8080/services |
| Book Appointment | http://localhost:8080/book |
| About | http://localhost:8080/about |
| Contact | http://localhost:8080/contact |

### Admin Panel:
| Page | URL |
|------|-----|
| Admin Login | http://localhost:8080/admin |
| Dashboard | http://localhost:8080/admin/dashboard |
| Manage Services | http://localhost:8080/admin/services |
| Manage Bookings | http://localhost:8080/admin/bookings |
| Settings | http://localhost:8080/admin/settings |

**Default Admin PIN:** `1234` (change this in settings!)

---

## 🎉 You're Done!

Your La'Couronne salon app is now running with:
- ✅ Frontend on http://localhost:8080
- ✅ Backend API on http://localhost:3001
- ✅ MySQL database via XAMPP

---

## 📁 Quick Reference - File Locations

```
hello-world-project/
├── .env                 ← Frontend config (VITE_API_URL)
├── src/                 ← Frontend React code
├── dist/                ← Built frontend (after npm run build)
├── server/
│   ├── .env             ← Backend config (database credentials)
│   ├── index.js         ← Main server file
│   ├── config.js        ← Configuration
│   ├── db.js            ← Database connection
│   ├── database-schema.sql  ← SQL schema to import
│   └── package.json     ← Server dependencies
└── package.json         ← Frontend dependencies
```

---

## 🔄 Daily Startup Routine

Every time you want to work on the project:

```bash
# 1. Start XAMPP (MySQL must be running)

# 2. Start Backend (Terminal 1)
cd hello-world-project/server
npm start

# 3. Start Frontend (Terminal 2)
cd hello-world-project
npm run dev

# 4. Open browser
# http://localhost:8080
```

---

## 🐛 Troubleshooting

### "Port 3306 is in use"
Another MySQL is running. Stop it or change XAMPP's port.

### "ECONNREFUSED 127.0.0.1:3306"
XAMPP MySQL is not running. Start it from XAMPP Control Panel.

### "Access denied for user 'root'"
XAMPP usually has no password. Check your `.env`:
```env
DB_USER=root
DB_PASSWORD=
```

### "Unknown database 'couronne'"
Database not created. Import `database-schema.sql` via phpMyAdmin.

### "Cannot find module 'express'"
Run `npm install` in the server folder.

### "CORS error"
Check `FRONTEND_URL` in server `.env` matches your frontend URL.

### Frontend shows old data
Clear browser cache or hard refresh (Ctrl+Shift+R)

---

## 📞 Support

If you're stuck:
1. Check both terminals for error messages
2. Verify XAMPP MySQL is running (green status)
3. Verify database `couronne` exists in phpMyAdmin
4. Check all `.env` files are configured correctly








