import mongoose, { Schema } from 'mongoose';

// Create the DB schema for users.
// The password will be encrypted.
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  //RBAC role for Admin user management such as locking accounts
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  locked: { type: Boolean, default: false },
});

export const User = mongoose.model('user', userSchema);
