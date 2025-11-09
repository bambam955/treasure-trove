import { User } from '../db/models/user.ts';
import type { UserInfo } from '@shared/users.ts';

class AdminService {
  static async getAllUsers(): Promise<UserInfo[]> {
    const users = await User.find({}, 'username role locked');
    return users.map((u) => ({
      id: u._id.toString(),
      username: u.username,
      tokens: u.tokens,
      role: u.role,
      locked: u.locked,
    }));
  }

  static async lockUser(id: string) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin' || user.canBeLocked === false) {
      throw new Error('Cannot lock admin or protected accounts');
    }
    user.locked = true;
    await user.save();
    return user;
  }

  static async unlockUser(id: string) {
    const user = await User.findById(id);
    if (!user) throw new Error('User not found');
    user.locked = false;
    await user.save();
    return user;
  }
}
export default AdminService;
