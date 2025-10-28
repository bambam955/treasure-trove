import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.ts';

interface UserCredentials {
  username: string;
  password: string;
}

class UsersService {
  static async login(auth: UserCredentials) {
    const user = await User.findOne({ username: auth.username });
    if (!user) {
      throw new Error('invalid username!');
    }
    const isPasswordCorrect = await bcrypt.compare(
      auth.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new Error('invalid password!');
    }
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });
    return token;
  }

  static async register(auth: UserCredentials) {
    const hashedPassword = await bcrypt.hash(auth.password, 10);
    const user = new User({
      username: auth.username,
      password: hashedPassword,
    });
    return await user.save();
  }

  static async getUserInfoById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) return { username: userId };
      return { username: user.username };
    } catch {
      return { username: userId };
    }
  }
}

export default UsersService;
