import * as yup from 'yup';

// Creating a bid requires inputting these fields.
const createBidSchema = yup.object({
  userId: yup.string().required(),
  amount: yup.number().required().min(0),
  auctionId: yup.string().required(),
});

// When the backend returns information about a bid, it contains
// all of the above fields plus bid ID and the creation date.
const bidInfoSchema = createBidSchema.concat(
  yup.object({
    id: yup.string().required(),
    createdDate: yup.date().required(),
  }),
);

export type CreateBidInfo = yup.InferType<typeof createBidSchema>;
export type BidInfo = yup.InferType<typeof bidInfoSchema>;

export { createBidSchema, bidInfoSchema };

export function findHighestBid(bids: BidInfo[]): BidInfo {
  if (bids.length === 0) throw new Error('no bids passed');
  let maxBid = bids[0];
  for (let i = 1; i < bids.length; i++) {
    if (bids[i].amount > maxBid.amount) {
      maxBid = bids[i];
    }
  }

  return maxBid;
}
