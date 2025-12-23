import mysql from 'mysql2/promise';
import { config } from './config.js';

// Create connection pool
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  socketPath: process.env.DB_SOCKET || undefined, // For XAMPP socket connection
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    console.log('   ℹ️  App will run in offline mode with mock data');
    console.log('   📝 To enable MySQL:');
    console.log('      1. Install MySQL server');
    console.log('      2. Update server/config.js with your credentials');
    console.log('      3. Run: npm run migrate');
    return false;
  }
}

export default pool;

