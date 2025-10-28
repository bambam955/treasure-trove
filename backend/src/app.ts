import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { postsRoutes } from './routes/posts.ts';
import { userRoutes } from './routes/users.ts';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

postsRoutes(app);
userRoutes(app);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from Express!');
});

export { app };
