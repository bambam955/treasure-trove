import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.ts';
import type { UserCredentials, UserInfo } from 'treasure-trove-shared';

class UsersService {
  // Login a user by verifying that the entered username and password
  // match what is in the database.
  static async login(auth: UserCredentials): Promise<string> {
    // First, find the user in the DB. If there is none then fail immediately.
    const user = await User.findOne({ username: auth.username });
    if (!user) {
      throw new Error('invalid username!');
    }

    // See if the password given matches the users's real encrypted password.
    // If not, then throw an error.
    const isPasswordCorrect = await bcrypt.compare(
      auth.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new Error('invalid password!');
    }

    // If the passwords match, the create a new JWT token and return it.
    // The token contains the user ID from the database (which is unique to all users)
    // and uses the static JWT secret for the private key. It expires in 24 hours.
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });
    return token;
  }

  // Register a new user account.
  static async signup(auth: UserCredentials) {
    // We don't store the password in plaintext in the DB of course. That would be terribly insecure.
    // Use an encrypted version with lots of salt instead.
    const hashedPassword = await bcrypt.hash(auth.password, 10);

    // Create the new user document and save it to the DB.
    const user = new User({
      username: auth.username,
      password: hashedPassword,
    });
    return await user.save();
  }

  // Get user info. If no username is found, the default is the user ID.
  static async getUserInfoById(userId: string): Promise<UserInfo> {
    try {
      const user = await User.findById(userId);
      if (!user) return { username: userId };
      return { username: user.username, tokens: user.tokens };
    } catch {
      return { username: userId };
    }
  }
}

export default UsersService;
