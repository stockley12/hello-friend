# La'Couronne Deployment Guide

This guide explains how to deploy the La'Couronne salon app to production.

## 📋 Prerequisites

- Node.js 18+ 
- MySQL/MariaDB 8+
- A VPS or cloud server (DigitalOcean, Railway, Render, etc.)
- Domain name (optional but recommended)

---

## 🏗️ Project Structure

```
hello-world-project/
├── src/                 # Frontend React app
├── dist/                # Built frontend (after npm run build)
├── server/              # Backend Express API
│   ├── index.js         # Main server file
│   ├── config.js        # Configuration
│   ├── db.js            # Database connection
│   └── migrate.js       # Database migrations
├── package.json         # Frontend dependencies
└── vite.config.ts       # Vite configuration
```

---

## 🚀 Deployment Options

### Option 1: Single Server (Recommended for beginners)

Both frontend and backend run on the same server.

### Option 2: Separate Services

- Frontend on Vercel/Netlify/Cloudflare Pages
- Backend on Railway/Render/DigitalOcean
- Database on PlanetScale/Railway/DigitalOcean

---

## 📦 Step-by-Step Deployment (Single Server)

### 1. Set Up Your Server

```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL/MariaDB
sudo apt-get install -y mariadb-server
sudo mysql_secure_installation
```

### 2. Clone Your Project

```bash
cd /var/www
git clone https://github.com/yourusername/couronne.git
cd couronne/hello-world-project
```

### 3. Configure the Database

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database and user
CREATE DATABASE couronne;
CREATE USER 'couronne_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON couronne.* TO 'couronne_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Configure Environment Variables

**Frontend (.env in project root):**
```bash
cd /var/www/couronne/hello-world-project
cp env.example.txt .env
nano .env
```

```env
VITE_API_URL=/api
```

**Backend (.env in server folder):**
```bash
cd server
cp env.example.txt .env
nano .env
```

```env
PORT=3001
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=couronne_user
DB_PASSWORD=your_secure_password
DB_NAME=couronne
FRONTEND_URL=https://yourdomain.com
ADMIN_PIN=your_secure_pin
```

### 5. Install Dependencies & Build

```bash
# Install frontend dependencies and build
cd /var/www/couronne/hello-world-project
npm install
npm run build

# Install server dependencies
cd server
npm install

# Run database migrations
npm run migrate
```

### 6. Start the Server

**For testing:**
```bash
npm start
```

**For production (with PM2):**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the server
pm2 start index.js --name couronne-api

# Save PM2 config
pm2 save

# Enable startup on reboot
pm2 startup
```

### 7. Set Up Nginx (Reverse Proxy)

```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/couronne
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/couronne /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Add SSL (HTTPS)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 Environment Variables Reference

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `/api` or `https://api.yourdomain.com/api` |

### Backend (server/.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment | `production` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database user | `couronne_user` |
| `DB_PASSWORD` | Database password | `secure_password` |
| `DB_NAME` | Database name | `couronne` |
| `FRONTEND_URL` | Allowed CORS origin | `https://yourdomain.com` |
| `ADMIN_PIN` | Admin panel PIN | `your_pin` |

---

## 🌐 Alternative: Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add a MySQL database from Railway dashboard
4. Set environment variables in Railway dashboard
5. Deploy!

---

## 📱 PWA Configuration

Update these files for your domain:

1. **public/manifest.json** - Update icons and app name
2. **public/sw.js** - Service worker for offline support
3. **index.html** - Update meta tags

---

## 🔒 Security Checklist

- [ ] Change default admin PIN
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall (ufw)
- [ ] Keep Node.js and packages updated
- [ ] Set up automated backups for database

---

## 🐛 Troubleshooting

### Database connection failed
```bash
# Check if MySQL is running
sudo systemctl status mariadb

# Check database credentials
mysql -u couronne_user -p -D couronne
```

### Frontend not loading
```bash
# Check if build was successful
ls -la dist/

# Rebuild if needed
npm run build
```

### PM2 issues
```bash
# View logs
pm2 logs couronne-api

# Restart
pm2 restart couronne-api
```

---

## 📞 Support

For issues, check the logs:
```bash
pm2 logs couronne-api --lines 100
```







