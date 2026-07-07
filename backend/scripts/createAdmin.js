import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB, { sequelize } from '../config/db.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await connectDB();

    const adminUser = {
      name: 'Admin User',
      email: 'admin@chocolate.com',
      password: 'admin123',
      isAdmin: true,
    };

    const existingAdmin = await User.findOne({ where: { email: adminUser.email } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      if (sequelize) await sequelize.close();
      process.exit(0);
    }

    const user = await User.create(adminUser);
    console.log('Admin user created successfully:', {
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });

    if (sequelize) await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdminUser();