import * as yup from 'yup';

const auctionInfoSchema = yup.object({
  id: yup.string().required(),
  title: yup.string().required(),
  description: yup.string().required(),
  sellerId: yup.string().required(),
  minimumBid: yup.number().required().min(0),
  endDate: yup.date().required(),
  buyerId: yup.string(),
  expectedValue: yup.number().min(0),
});

export type AuctionInfo = yup.InferType<typeof auctionInfoSchema>;

export { auctionInfoSchema };
