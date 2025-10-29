import mongoose from 'mongoose';

export async function initDatabase(): Promise<typeof mongoose> {
  // Get the DB URL from the environment variable.
  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('no database URL given!!');
  }

  // Create the DB connection.
  mongoose.connection.on('open', () => {
    console.info('successfully connected to database:', DATABASE_URL);
  });

  const connection = mongoose.connect(DATABASE_URL!);
  return connection;
}
