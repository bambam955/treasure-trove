import mongoose, { Schema } from 'mongoose';
import type { InferSchemaType } from 'mongoose';

// Create the DB schema for users.
const userSchema = new Schema(
  {
    // No two accounts can have the same username, for obvious reasons.
    username: { type: String, required: true, unique: true },
    // The password will be encrypted.
    password: { type: String, required: true },

    //RBAC role for Admin user management such as locking accounts
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    locked: { type: Boolean, default: false },
    canBeLocked: { type: Boolean, default: true }, // Certain accounts cannot be locked

    // "Tokens" are fake money in the platform.
    tokens: { type: Number, required: true, default: 1000 },

    // Points can go up or down from auctions and feedback.
    points: { type: Number, default: 0 },

    purchasedAuctions: [
      { type: Schema.Types.ObjectId, ref: 'auction' }
    ],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model('user', userSchema);
export type UserDataType = InferSchemaType<typeof userSchema>;
