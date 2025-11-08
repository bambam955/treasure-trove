import 'dotenv/config';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { User } from '../db/models/user.ts';
import { initDatabase } from '../db/init.ts';

async function createAdmin() {
  try {
    await initDatabase();

    const username = 'admin'; 
    const password = 'Team13Admin!'; 

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username });
    if (existingAdmin) {
      console.log(`Admin user "${username}" already exists.`);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user with a role
    const adminUser = new User({
      username,
      password: hashedPassword,
      role: 'admin', 
      locked: false,
      canBelocked: false,
    });

    await adminUser.save();
    console.log(`Admin user "${username}" created successfully.`);
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    await mongoose.disconnect();
  }
}
createAdmin();
