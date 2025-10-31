// This interface defines the credentials a user should sign up/log in with.
export interface UserCredentials {
  username: string;
  password: string;
}

// This interface defines the information about users that can be fetched from the database.
export interface UserInfo {
  username: string;
  tokens?: number;
}
