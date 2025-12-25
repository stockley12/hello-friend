# XAMPP Setup Guide for La'Couronne

This guide will help you connect your La'Couronne salon app to XAMPP's MySQL database.

---

## 📋 Prerequisites

- XAMPP installed ([Download here](https://www.apachefriends.org/))
- Node.js 18+ installed
- Your project files

---

## 🚀 Step-by-Step Setup

### Step 1: Start XAMPP

1. Open **XAMPP Control Panel**
2. Click **Start** next to **Apache** (optional, for phpMyAdmin)
3. Click **Start** next to **MySQL**
4. Wait until both show green "Running" status

![XAMPP Control Panel](https://i.imgur.com/example.png)

---

### Step 2: Create the Database

#### Option A: Using phpMyAdmin (Recommended)

1. Click **Admin** button next to MySQL in XAMPP Control Panel
   - Or open browser: `http://localhost/phpmyadmin`

2. Click **Import** tab at the top

3. Click **Choose File** and select:
   ```
   hello-world-project/server/database-schema.sql
   ```

4. Click **Go** at the bottom

5. You should see "Import has been successfully finished"

#### Option B: Using MySQL Command Line

```bash
# Windows (from XAMPP folder)
cd C:\xampp\mysql\bin
mysql -u root -p < "C:\path\to\hello-world-project\server\database-schema.sql"

# Linux
mysql -u root -p < /path/to/hello-world-project/server/database-schema.sql
```

---

### Step 3: Create Database User (Recommended for Security)

In phpMyAdmin:

1. Click **User accounts** tab
2. Click **Add user account**
3. Fill in:
   - **User name:** `couronne_user`
   - **Host name:** `localhost`
   - **Password:** Choose a strong password
4. Under "Database for user account":
   - Check ✅ "Grant all privileges on database couronne"
5. Click **Go**

---

### Step 4: Configure the Server

1. Navigate to the server folder:
   ```bash
   cd hello-world-project/server
   ```

2. Create environment file:
   ```bash
   cp env.example.txt .env
   ```

3. Edit `.env` file with your settings:

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

   # If you created a user in Step 3, use these instead:
   # DB_USER=couronne_user
   # DB_PASSWORD=your_password_here

   # Frontend URL
   FRONTEND_URL=http://localhost:8080
   ```

---

### Step 5: Install Server Dependencies

```bash
cd hello-world-project/server
npm install
```

---

### Step 6: Test the Connection

```bash
npm start
```

You should see:
```
🚀 Server running on http://localhost:3001
✅ MySQL connected successfully
```

If you see "MySQL connection failed", check:
- XAMPP MySQL is running (green status)
- Database credentials in `.env` are correct
- Database `couronne` exists in phpMyAdmin

---

### Step 7: Start the Frontend

Open a new terminal:

```bash
cd hello-world-project
npm run dev
```

---

### Step 8: Configure Frontend API URL

Create `.env` in the project root:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## ✅ Verify Everything Works

1. Open `http://localhost:8080` (frontend)
2. Open `http://localhost:3001/api/health` (backend health check)

You should see:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

---

## 🗂️ Database Structure

After import, you'll have these tables in phpMyAdmin:

| Table | Description |
|-------|-------------|
| `services` | Salon services (braids, twists, etc.) |
| `staff` | Stylists and their schedules |
| `clients` | Customer information |
| `bookings` | Appointments |
| `settings` | Salon configuration |
| `gallery` | Image gallery (optional) |

---

## 🔧 Common XAMPP Ports

| Service | Default Port |
|---------|-------------|
| Apache | 80 |
| MySQL | 3306 |
| phpMyAdmin | 80/phpmyadmin |

If port 3306 is busy, you can change it in XAMPP config.

---

## 🐛 Troubleshooting

### "Access denied for user 'root'@'localhost'"

XAMPP's default MySQL has no password. Make sure:
```env
DB_USER=root
DB_PASSWORD=
```
(Leave password empty)

### "Can't connect to MySQL server"

1. Check XAMPP Control Panel - MySQL should be green
2. Try restarting MySQL in XAMPP
3. Check if port 3306 is in use by another program

### "Unknown database 'couronne'"

The database wasn't created. Import the SQL file again through phpMyAdmin.

### "CORS error in browser"

Make sure your `.env` has:
```env
FRONTEND_URL=http://localhost:8080
```

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `server/.env` | Database credentials |
| `server/database-schema.sql` | SQL schema to import |
| `.env` (project root) | Frontend API URL |

---

## 🔐 Security Notes

For production:
1. Create a dedicated MySQL user (not root)
2. Use a strong password
3. Change the default admin PIN
4. Enable HTTPS

---

## 📞 Quick Commands Reference

```bash
# Start XAMPP MySQL (Linux)
sudo /opt/lampp/lampp startmysql

# Start backend server
cd server && npm start

# Start frontend dev server
npm run dev

# Import database (command line)
mysql -u root -p couronne < database-schema.sql
```








