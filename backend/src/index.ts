import { app } from './app.ts';
import 'dotenv/config';
import { initDatabase } from './db/init.ts';

try {
  await initDatabase();
  const PORT = process.env.PORT;
  app.listen(PORT);
  console.info(`express server running on http://localhost:${PORT}`);
} catch (err) {
  console.error('error connecting to database:', err);
}
