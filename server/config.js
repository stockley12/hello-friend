import dotenv from 'dotenv';
dotenv.config();

// Database & Server Configuration
// Set these environment variables or modify the defaults below
export const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'couronne',
  },
  server: {
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  cors: {
    // Frontend URLs allowed to access the API
    allowedOrigins: process.env.FRONTEND_URL 
      ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
      : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
  },
};



