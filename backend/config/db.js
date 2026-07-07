import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.MYSQL_DATABASE || 'chocolate_db';
const dbUser = process.env.MYSQL_USER || 'root';
const dbPassword = process.env.MYSQL_PASSWORD || '';
const dbHost = process.env.MYSQL_HOST || '127.0.0.1';
const dbPort = process.env.MYSQL_PORT || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  logging: false,
  define: {
    timestamps: true,
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`🍃 MySQL Connected: ${dbHost}:${dbPort}/${dbName}`);
    
    // Sync models
    await sequelize.sync({ alter: true });
    return sequelize;
  } catch (error) {
    console.warn(`⚠️ MySQL connection failed: ${error.message}`);
    console.warn('Continuing without a database connection. Configure MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT to connect to a running MySQL instance.');
    return null;
  }
};

export { sequelize };
export default connectDB;
