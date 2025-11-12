import express from 'express';
import type { Request, Response } from 'express';
import UsersService from '../services/users.ts';
import { requireAuth } from '../middleware/jwt.ts';
import { userCredentialsSchema, userInfoSchema } from 'treasure-trove-shared';

const usersRouter = express.Router();

// Endpoint for registering a new account.
usersRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const validatedBody = userCredentialsSchema.validateSync(req.body);
    const user = await UsersService.signup(validatedBody);
    // Use 201 when a POST request successfully creates a new resource on the server.
    return res.status(201).json(user);
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(400).json({
      error: 'Failed to sign up. Does username already exist?',
    });
  }
});

// Endpoint for user login.
usersRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedBody = userCredentialsSchema.validateSync(req.body);
    const authInfo = await UsersService.login(validatedBody);
    return res.status(200).json(authInfo);
  } catch (error) {
    console.error('Login error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown login error';

    if (message.toLowerCase().includes('locked')) {
      return res.status(403).json({
        error: message,
      });
    }

    return res.status(400).json({ error: 'Invalid login credentials' });
  }
});

// Endpoint for retrieving user information. Requires JWT authentication.
usersRouter.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const userInfo = await UsersService.getUserInfoById(req.params.id);
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error fetching user info:', error);
    return res.status(404).json({ error: 'User not found' });
  }
});

usersRouter.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const validatedBody = userInfoSchema.validateSync(req.body);
    const userInfo = await UsersService.updateUser(
      req.params.id,
      validatedBody,
    );
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error('error updating user:', error);
    // Use 400 when there is a bad request for some reason.
    return res.status(400).json({
      error: 'failed to update user',
    });
  }
});

export default usersRouter;
