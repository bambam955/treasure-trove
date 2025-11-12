import { User } from '../db/models/user.ts';

class AdminService {
  static async getAllUsers() {
    return await User.find({}, 'username role locked tokens');
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
