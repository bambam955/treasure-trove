import type { Application, Request, Response } from 'express';
import UsersService from '../services/users.ts';
import { requireAuth } from '../middleware/jwt.ts';

export function setupUserEndpoints(app: Application) {
  // Endpoint for user login.
  app.post('/api/v1/user/login', async (req: Request, res: Response) => {
    try {
      const { token } = await UsersService.login(req.body);
      return res.status(200).send({ token });
    } catch (error) {
      console.error('Login error:', error);

      const message = error instanceof Error ? error.message : 'Unkown logiin error';

      if (message.toLowerCase().includes('locked')) {
        return res.status(403).json({
          error: 'This account has been locked. Please contact an administrator.',
        });
      }

      if (message.toLowerCase().includes('username')) {
        return res.status(400).json({ error: 'Invalid username.' });
      }

      if (message.toLowerCase().includes('password')) {
        return res.status(400).json({ error: 'Invalid password.' });
      }

      return res.status(400).json({
        error: 'Login failed, did you enter the correct username/password?',
      });
    }
  });

  // Endpoint for registering a new account.
  app.post('/api/v1/user/signup', async (req: Request, res: Response) => {
    try {
      const user = await UsersService.signup(req.body);
      // Use 201 when a POST request successfully creates a new resource on the server.
      return res.status(201).send(user);
    } catch (err) {
      console.error('error adding user:', err);
      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      });
    }
  });

  // Endpoint for retrieving user information. Requires JWT authentication.
  app.get(
    '/api/v1/users/:id',
    requireAuth,
    async (req: Request, res: Response) => {
      const userInfo = await UsersService.getUserInfoById(req.params.id);
      return res.status(200).send(userInfo);
    },
  );

  app.post(
    '/api/v1/users/:id',
    requireAuth,
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
        });
      }
    },
  );
}
