import express, { Request, Response } from 'express';
import { getAllUsers, lockUser, unlockUser } from '../services/admin.ts';
import { isAdmin } from '../middleware/isAdmin.ts';

const router = express.Router();

//  GET all users (admin only)
router.get('/users', isAdmin, async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

//  POST lock user by ID
router.post('/lock/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    await lockUser(req.params.id);
    res.status(200).json({ message: 'User locked' });
  } catch (err) {
    console.error('Error locking user:', err);
    res.status(500).json({ error: 'Failed to lock user' });
  }
});

//  POST unlock user by ID
router.post('/unlock/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    await unlockUser(req.params.id);
    res.status(200).json({ message: 'User unlocked' });
  } catch (err) {
    console.error('Error unlocking user:', err);
    res.status(500).json({ error: 'Failed to unlock user' });
  }
});

export default router;
