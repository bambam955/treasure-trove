import express from 'express';
import type { Request, Response } from 'express';
import UsersService from '../services/users.ts';
import {
  regularUserInfoSchema,
  userCredentialsSchema,
  updateUserInfoSchema,
} from 'treasure-trove-shared';
import { checkAdmin } from '../middleware/isAdmin.ts';
import { userFullAuth } from '../middleware/userAuth.ts';
import { type AuthenticatedRequest } from '../middleware/types.ts';

const usersRouter = express.Router();

// POST a new login attempt.
usersRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const validatedBody = userCredentialsSchema.validateSync(req.body);
    const authInfo = await UsersService.login(validatedBody);
    return res.status(200).json(authInfo);
  } catch (error) {
    console.error('Login error:', error);

    const message =
      error instanceof Error ? error.message : 'Unknown login error';

    // We want to return a 403 status code if the user is locked,
    // so look for that particular message first.
    if (message.toLowerCase().includes('locked')) {
      return res.status(403).json({
        error: message,
      });
    }

    // Otherwise, if there was an error, it was probably invalid credentials.
    // Just return a 400.
    return res.status(400).json({ error: 'Invalid login credentials' });
  }
});

// POST registration for a new account.
usersRouter.post('/signup', async (req: Request, res: Response) => {
  try {
    const validatedBody = userCredentialsSchema.validateSync(req.body);
    console.log('TRYING TO SIGN UP NEW USER! name:', validatedBody);
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

// GET information about a user. Requires JWT authentication at minimum.
// Admin-only fields like lock status will only be returned with admin authentication.
usersRouter.get(
  '/:id',
  userFullAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if the user's token has admin privileges.
      const isAdmin = (await checkAdmin(req.auth)) === 200;
      const userInfo = await UsersService.getUserInfoById(req.params.id);

      // The service gives us all the info. If the requester is admin, return everything.
      // Otherwise, take out the admin-only fields and return the rest.
      if (isAdmin) {
        return res.status(200).json(userInfo);
      } else {
        const data = regularUserInfoSchema.validateSync(userInfo, {
          stripUnknown: true,
        });
        return res.status(200).json(data);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(404).json({ error: 'User not found' });
    }
  },
);

// PUT updated user information into the database.
// JWT authentication is the minimum requirement for all requests.
// Changing fields like lock status requires admin authentication.
usersRouter.put(
  '/:id',
  userFullAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if the user's token has admin privileges.
      const isAdmin = (await checkAdmin(req.auth)) === 200;
      if (!isAdmin) {
        return res
          .status(403)
          .json({ error: 'Only admins can update user accounts' });
      }
      // Validate the request body against the update schema.
      const validatedBody = updateUserInfoSchema.validateSync(req.body, {
        stripUnknown: true,
      });
      // Update the user info. Note that using the validated body ensures
      // only fields the user is permitted to update will be updated.
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
  },
);

export default usersRouter;
