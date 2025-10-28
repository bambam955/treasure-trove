import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../db/models/user.ts';

interface LoginData {
  username: string;
  password: string;
}

interface SignupData {
  username: string;
  password: string;
}

export async function loginUser({ username, password }: LoginData) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('invalid username!');
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Error('invalid password!');
  }
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '24h',
  });
  return token;
}

export async function createUser({ username, password }: SignupData) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  return await user.save();
}

export async function getUserInfoById(userId: string) {
  try {
    const user = await User.findById(userId);
    if (!user) return { username: userId };
    return { username: user.username };
  } catch {
    return { username: userId };
  }
}
