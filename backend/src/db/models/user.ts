import mongoose, { Schema } from 'mongoose';
import type { InferSchemaType } from 'mongoose';
import type { UserInfo } from '@shared/users.ts';

// Create the DB schema for users.
const userSchema = new Schema({
  // No two accounts can have the same username, for obvious reasons.
  username: { type: String, required: true, unique: true },
  // The password will be encrypted.
  password: { type: String, required: true },

  //RBAC role for Admin user management such as locking accounts
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  locked: { type: Boolean, default: false },
  canBeLocked: { type: Boolean, default: true }, // Certain accounts cannot be locked

  // "Tokens" are fake money in the platform.
  tokens: { type: Number, required: true, default: 0 },
});

export const User = mongoose.model('user', userSchema);
type UserType = InferSchemaType<typeof userSchema>;

export function parseUserInfo(userId: string, user: UserType): UserInfo {
  return {
    id: userId,
    username: user.username,
    role: user.role,
    locked: user.locked,
    canBeLocked: user.canBeLocked,
    tokens: user.tokens,
  };
}
