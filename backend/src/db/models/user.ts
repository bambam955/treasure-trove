import mongoose, { Schema } from 'mongoose';

// Create the DB schema for users.
// The password will be encrypted.
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model('user', userSchema);
