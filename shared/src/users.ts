import * as yup from 'yup';

// This interface defines the credentials a user should sign up/log in with.
const userCredentialsSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});
export type UserCredentials = yup.InferType<typeof userCredentialsSchema>;

// This interface defines the information about users that can be fetched from the database.
const userInfoSchema = yup.object({
  id: yup.string().required(),
  username: yup.string(),
  role: yup.string().oneOf(['admin', 'user']),
  locked: yup.boolean(),
  canBeLocked: yup.boolean(),
  tokens: yup.number().min(0),
});
export type UserInfo = yup.InferType<typeof userInfoSchema>;

// This interface defines the information that will be returned from a successful login attempt.
export interface AuthInfo {
  token: string;
}

export { userCredentialsSchema, userInfoSchema };
