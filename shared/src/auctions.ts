import * as yup from 'yup';

// These are the only fields of an auction that can be updated after an auction is created.
const updateAuctionSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  buyerId: yup.string(),
  status: yup.string().oneOf(['active', 'closed', 'purchased']),
  finalBidAmount: yup.number(),
});
// Creating an auction requires the above fields plus these additional ones.
// These fields cannot be updated after the auction is created.
const createAuctionSchema = updateAuctionSchema.concat(
  yup.object({
    sellerId: yup.string().required(),
    minimumBid: yup.number().required().min(0),
    endDate: yup.mixed<string | Date>().required(),
    expectedValue: yup.number().min(0),
  }),
);

// When the backend returns information about an auction, it includes
// all of the above fields plus the auction ID.
const auctionInfoSchema = createAuctionSchema.concat(
  yup.object({
    id: yup.string().required(),
    createdDate: yup.date().required(),
  }),
);

export type UpdateAuctionInfo = yup.InferType<typeof updateAuctionSchema>;
export type CreateAuctionInfo = yup.InferType<typeof createAuctionSchema>;
export type AuctionInfo = yup.InferType<typeof auctionInfoSchema>;

export { updateAuctionSchema, createAuctionSchema, auctionInfoSchema };
