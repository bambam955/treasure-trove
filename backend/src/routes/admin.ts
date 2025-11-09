import express from 'express';
import type { Request, Response } from 'express';
import AdminService from '../services/admin.ts';
import { isAdmin } from '../middleware/isAdmin.ts';

const router = express.Router();

//  GET all users (admin only)
router.get('/users', isAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await AdminService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

//  POST lock user by ID
router.post('/users/lock/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    await AdminService.lockUser(req.params.id);
    res.status(200).json({ message: 'User locked' });
  } catch (err) {
    console.error('Error locking user:', err);
    res.status(500).json({ error: 'Failed to lock user' });
  }
});

//  POST unlock user by ID
router.post(
  '/users/unlock/:id',
  isAdmin,
  async (req: Request, res: Response) => {
    try {
      await AdminService.unlockUser(req.params.id);
      res.status(200).json({ message: 'User unlocked' });
    } catch (err) {
      console.error('Error unlocking user:', err);
      res.status(500).json({ error: 'Failed to unlock user' });
    }
  },
);

export default router;
