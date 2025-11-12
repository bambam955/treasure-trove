// This interface defines the credentials a user should sign up/log in with.
export interface UserCredentials {
  username: string;
  password: string;
}

// This interface defines the information about users that can be fetched from the database.
export interface UserInfo {
  _id: string;
  username: string;
  tokens?: number;
  role?: 'admin' | 'user';
  locked?: boolean;
}

// This interface defines the information that will be returned from a successful login attempt.
export interface AuthInfo {
  token: string;
}
