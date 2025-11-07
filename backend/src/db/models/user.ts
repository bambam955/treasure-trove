import mongoose, { Schema } from 'mongoose';

// Create the DB schema for users.
const userSchema = new Schema({
  // No two accounts can have the same username, for obvious reasons.
  username: { type: String, required: true, unique: true },
  // The password will be encrypted.
  password: { type: String, required: true },

  //RBAC role for Admin user management such as locking accounts
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  locked: { type: Boolean, default: false },

  // "Tokens" are fake money in the platform.
  tokens: { type: Number, required: true, default: 0 },
});

export const User = mongoose.model('user', userSchema);
