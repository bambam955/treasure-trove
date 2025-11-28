import 'dotenv/config';
import app from './app.ts';
import { initDatabase } from './db/init.ts';
import { startAuctionCloseWorker } from './worker/auctionCloser.ts';
async function main() {
  // Connect to the database.
  try {
    await initDatabase();
  } catch (err) {
    console.error('error connecting to database:', err);
    return;
  }
  // Start the auction closer worker.
  startAuctionCloseWorker();

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
