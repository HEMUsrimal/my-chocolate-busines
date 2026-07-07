import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.MYSQL_DATABASE || 'chocolate_db';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || '';
const dbHost = process.env.MYSQL_HOST || '127.0.0.1';
const dbPort = process.env.MYSQL_PORT || 3306;

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`✅ Database "${dbName}" created or already exists.`);
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    process.exit(1);
  }
}

createDb();
