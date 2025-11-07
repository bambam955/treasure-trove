import { User } from '../db/models/user.ts';

export async function getAllUsers() {
  return await User.find({}, 'username role locked');
}

export async function lockUser(id: string) {
  return await User.findByIdAndUpdate(id, { locked: true });
}

export async function unlockUser(id: string) {
  return await User.findByIdAndUpdate(id, { locked: false });
}
