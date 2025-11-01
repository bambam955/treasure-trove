import type { Application, Request, Response } from 'express';
import UsersService from '../services/users.ts';

export function setupUserEndpoints(app: Application) {
  // Endpoint for user login.
  app.post('/api/v1/user/login', async (req: Request, res: Response) => {
    try {
      const authInfo = await UsersService.login(req.body);
      return res.status(200).send(authInfo);
    } catch {
      return res.status(400).send({
        error: 'login failed, did you enter the correct username/password?',
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

  // Endpoint for retrieving user information.
  app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
    const userInfo = await UsersService.getUserInfoById(req.params.id);
    return res.status(200).send(userInfo);
  });
}
