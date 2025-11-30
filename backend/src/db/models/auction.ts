import mongoose, { Schema } from 'mongoose';
import type { InferSchemaType } from 'mongoose';

// Create the DB schema for auctions.
const auctionSchema = new Schema(
  {
    // Basic information about the auction.
    // All of this should be set when the auction is created.
    title: { type: String, required: true },
    description: { type: String, required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    minimumBid: { type: Number, required: true, default: 0 },
    endDate: { type: Date, required: true, default: new Date() },

    // Auction status to track whether it's active, closed, or purchased.
    status: {
      type: String,
      enum: ['active', 'closed', 'purchased'],
      default: 'active',
    },

    // This won't be filled in until the auction finishes.
    buyerId: { type: Schema.Types.ObjectId, ref: 'user' },

    // This will be updated as bids come in.
    finalBidAmount: { type: Number, default: 0 },

    // These fields are used for the feedback system.
    expectedValue: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export const Auction = mongoose.model('auction', auctionSchema);
export type AuctionDataType = InferSchemaType<typeof auctionSchema>;
