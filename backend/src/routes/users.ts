import type { Application, Request, Response } from 'express';
import UsersService from '../services/users.ts';

export function setupUserEndpoints(app: Application) {
  app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
    const userInfo = await UsersService.getUserInfoById(req.params.id);
    return res.status(200).send(userInfo);
  });

  app.post('/api/v1/user/login', async (req: Request, res: Response) => {
    try {
      const token = await UsersService.login(req.body);
      return res.status(200).send({ token });
    } catch {
      return res.status(400).send({
        error: 'login failed, did you enter the correct username/password?',
      });
    }
  });

  // Register a new user account.
  app.post('/api/v1/user/signup', async (req: Request, res: Response) => {
    try {
      const user = await UsersService.register(req.body);
      return res.status(201).json({ username: user.username });
    } catch (err) {
      console.error('error adding user:', err);
      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      });
    }
  });
}
