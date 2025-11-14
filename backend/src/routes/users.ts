import express from 'express';
import type { Request, Response } from 'express';
import UsersService from '../services/users.ts';
import { requireAuth } from '../middleware/jwt.ts';
<<<<<<< HEAD
import { isAdmin } from '../middleware/isAdmin.ts';
=======
import {
  fullUserInfoSchema,
  regularUserInfoSchema,
  userCredentialsSchema,
} from 'treasure-trove-shared';
import {
  type AuthenticatedRequest,
  checkAdmin,
} from '../middleware/isAdmin.ts';
>>>>>>> develop

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
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if the user's token has admin privileges.
      const isAdmin = (await checkAdmin(req.auth)) === 200;
      const userInfo = await UsersService.getUserInfoById(req.params.id);

<<<<<<< HEAD
  app.post(
    '/api/v1/users/:id',
    requireAuth,
    isAdmin,
    async (req: Request, res: Response) => {
      try {
        const userInfo = await UsersService.updateUserTokens(
          req.params.id,
          req.body.tokens,
        );
        return res.status(200).send(userInfo);
      } catch (err) {
        console.error('error updating token amount:', err);
        // Use 400 when there is a bad request for some reason.
        return res.status(400).json({
          error:
            'failed to update user tokens amount, did you specify the amount to update to?',
=======
      // The service gives us all the info. If the requester is admin, return everything.
      // Otherwise, take out the admin-only fields and return the rest.
      if (isAdmin) {
        return res.status(200).json(userInfo);
      } else {
        const data = regularUserInfoSchema.validateSync(userInfo, {
          stripUnknown: true,
>>>>>>> develop
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
  requireAuth,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Check if the user's token has admin privileges.
      const isAdmin = (await checkAdmin(req.auth)) === 200;
      // Validate the request body using the proper schema based on admin status.
      const schema = isAdmin ? fullUserInfoSchema : regularUserInfoSchema;
      const validatedBody = schema.validateSync(req.body);

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
