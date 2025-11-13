import { type FullUserInfo } from 'treasure-trove-shared';
import { User } from '../db/models/user.ts';
import UsersService from './users.ts';

class AdminService {
  // Fetch all data about all users in the database.
  static async getAllUsers(): Promise<FullUserInfo[]> {
    const users = await User.find({}, 'username role locked');
    return users.map((u) =>
      UsersService.parseFullUserInfo(u._id.toString(), u),
    );
  }

  // Lock a particular user's account.
  static async lockUser(userId: string): Promise<FullUserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.role === 'admin') throw new Error('cannot lock an admin account');
    // Use === to ensure that the value isn't just null.
    if (user.canBeLocked === false)
      throw new Error('cannot lock protected account');

    user.locked = true;
    await user.save();

    return UsersService.parseFullUserInfo(userId, user);
  }

  // Unlock a particular user's account.
  static async unlockUser(userId: string): Promise<FullUserInfo> {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.locked = false;
    await user.save();
    return UsersService.parseFullUserInfo(userId, user);
  }
}
export default AdminService;
