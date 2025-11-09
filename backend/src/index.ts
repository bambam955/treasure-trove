import 'dotenv/config';
import app from './app.ts';
import { initDatabase } from './db/init.ts';

async function main() {
  // Connect to the database.
  try {
    await initDatabase();
  } catch (err) {
    console.error('error connecting to database:', err);
    return;
  }

  // Start the backend server.
  try {
    const PORT = process.env.PORT;
    app.listen(PORT);
    console.info(`express server running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('error starting express server:', err);
  }
}

main();
