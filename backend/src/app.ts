import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { setupUserEndpoints } from './routes/users.ts';
import bodyParser from 'body-parser';

// Create the Express app.
const app = express();

// Set up middleware...
// We only want to deal with requests that respond with JSON,
// and we have to take care of CORS errors.
app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Browsers will often send an OPTIONS request before actual requests
  // to see if the actual request will be allowed by the server.
  // However, we aren't that advanced...so we just tell the browser
  // that anything it tries will be allowed.
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// Set up the endpoints for user management.
setupUserEndpoints(app);

// Add a default response for the root of the API.
app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from Express!');
});

export default app;
