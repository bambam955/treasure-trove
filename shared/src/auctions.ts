import * as yup from 'yup';

const updateAuctionSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  buyerId: yup.string(),
});
const createAuctionSchema = updateAuctionSchema.concat(
  yup.object({
    sellerId: yup.string().required(),
    minimumBid: yup.number().required().min(0),
    endDate: yup.date().required(),
    expectedValue: yup.number().min(0),
  }),
);
const auctionInfoSchema = createAuctionSchema.concat(
  yup.object({
    id: yup.string().required(),
  }),
);

export type UpdateAuctionInfo = yup.InferType<typeof updateAuctionSchema>;
export type CreateAuctionInfo = yup.InferType<typeof createAuctionSchema>;
export type AuctionInfo = yup.InferType<typeof auctionInfoSchema>;

export { updateAuctionSchema, createAuctionSchema, auctionInfoSchema };
