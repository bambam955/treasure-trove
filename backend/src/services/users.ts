import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { parseUserInfo, User } from '../db/models/user.ts';
import type { UserCredentials, UserInfo, AuthInfo } from '@shared/users.ts';

const SIGNUP_TOKEN_BONUS = 1000;

class UsersService {
  // Login a user by verifying that the entered username and password
  // match what is in the database.
  static async login(auth: UserCredentials): Promise<AuthInfo> {
    // First, find the user in the DB. If there is none then fail immediately.
    const user = await User.findOne({ username: auth.username });
    if (!user) throw new Error('invalid username!');

    // locked users cannot log in.
    if (user.locked) {
      throw new Error(
        'This account has been locked. Please contact an administrator.',
      );
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
    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET!,
      {
        expiresIn: '24h',
      },
    );
    return { token };
  }

  private static validatePassword(password: string): boolean {
    // Check for minimum character length
    if (password.length < 7) return false;
    // Check for at least one digit
    if (!/\d/.test(password)) return false;
    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;

    return true;
  }

  // Register a new user account.
  static async signup(auth: UserCredentials): Promise<UserInfo> {
    // Validate the password in the backend too.
    // This is an extra layer of security in case someone tries to get around the frontend restrictions.
    if (!this.validatePassword(auth.password)) {
      throw new Error('Invalid password format');
    }

    // We don't store the password in plaintext in the DB of course. That would be terribly insecure.
    // Use an encrypted version with lots of salt instead.
    const hashedPassword = await bcrypt.hash(auth.password, 10);

    // Create the new user document and save it to the DB.
    const user = new User({
      username: auth.username,
      password: hashedPassword,
      role: 'user', // default role is 'user'
      tokens: SIGNUP_TOKEN_BONUS, // Give new users a sign-up bonus!!
    });
    await user.save();
    return parseUserInfo(user._id.toString(), user);
  }

  // Get user info. If no username is found, the default is the user ID.
  static async getUserInfoById(userId: string): Promise<UserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('could not find user!');
    return parseUserInfo(userId, user);
  }

  static async updateUser(
    userId: string,
    newUser: Partial<UserInfo>,
  ): Promise<UserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('could not update user!');
    user.set(newUser);
    await user.save();

    return parseUserInfo(userId, user);
  }
}

export default UsersService;
