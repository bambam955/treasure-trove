import { parseUserInfo, User } from '../db/models/user.ts';
import type { UserInfo } from '@shared/users.ts';

class AdminService {
  static async getAllUsers(): Promise<UserInfo[]> {
    const users = await User.find({}, 'username role locked');
    return users.map((u) => parseUserInfo(u._id.toString(), u));
  }

  static async lockUser(userId: string): Promise<UserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('cannot lock an admin account');
    if (user.canBeLocked === false)
      throw new Error('cannot lock protected account');

    user.locked = true;
    await user.save();

    return parseUserInfo(userId, user);
  }

  static async unlockUser(userId: string): Promise<UserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.locked = false;
    await user.save();
    return parseUserInfo(userId, user);
  }
}
export default AdminService;
