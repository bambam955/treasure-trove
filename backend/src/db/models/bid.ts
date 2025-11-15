import mongoose, { Schema } from 'mongoose';
import type { InferSchemaType } from 'mongoose';

// Create the DB schema for auction bids.
const bidSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    amount: { type: Number, required: true },
    auctionId: { type: Schema.Types.ObjectId, ref: 'auction', required: true },
  },
  {
    timestamps: true,
  },
);

export const Bid = mongoose.model('bid', bidSchema);
export type BidDataType = InferSchemaType<typeof bidSchema>;
