import * as yup from 'yup';

// This interface defines the credentials a user should sign up/log in with.
const userCredentialsSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});
export type UserCredentials = yup.InferType<typeof userCredentialsSchema>;

// This interface defines the information about users that can be fetched from the database.
// Regular user info can be fetched by anyone; full user info can only be fetched by admins.
const regularUserInfoSchema = yup.object({
  id: yup.string().required(),
  username: yup.string(),
  role: yup.string().oneOf(['admin', 'user']),
  tokens: yup.number().min(0).required(),
  points: yup.number().required(),
  purchasedAuctions: yup.array(yup.string()).required(),
});
const fullUserInfoSchema = regularUserInfoSchema.concat(
  yup.object({
    locked: yup.boolean(),
    canBeLocked: yup.boolean(),
  }),
);
const updateUserInfoSchema = yup
  .object({
    tokens: yup.number().min(0),
    points: yup.number(),
    locked: yup.boolean(),
    canBeLocked: yup.boolean(),
  })
  .noUnknown();

export type RegularUserInfo = yup.InferType<typeof regularUserInfoSchema>;
export type FullUserInfo = yup.InferType<typeof fullUserInfoSchema>;
export type UpdateUserInfo = yup.InferType<typeof updateUserInfoSchema>;

// This interface defines the information that will be returned from a successful login attempt.
export interface AuthInfo {
  token: string;
}

export {
  userCredentialsSchema,
  regularUserInfoSchema,
  fullUserInfoSchema,
  updateUserInfoSchema,
};
