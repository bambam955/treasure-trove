import { type FullUserInfo } from 'treasure-trove-shared';
import { User } from '../db/models/user.ts';
import UsersService from './users.ts';

class AdminService {
  static async getAllUsers(): Promise<FullUserInfo[]> {
    const users = await User.find({}, 'username role locked');
    return users.map((u) =>
      UsersService.parseFullUserInfo(u._id.toString(), u),
    );
  }

  static async lockUser(userId: string): Promise<FullUserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('cannot lock an admin account');
    if (user.canBeLocked === false)
      throw new Error('cannot lock protected account');

    user.locked = true;
    await user.save();

    return UsersService.parseFullUserInfo(userId, user);
  }

  static async unlockUser(userId: string): Promise<FullUserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.locked = false;
    await user.save();
    return UsersService.parseFullUserInfo(userId, user);
  }
}
export default AdminService;
