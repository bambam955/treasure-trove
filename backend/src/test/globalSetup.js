import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: {
      // Using this version to be compatible with WSL, Ubuntu 24.04
      version: '8.0.0',
    },
  });

  global.__MONGOINSTANCE = instance;

  process.env.DATABASE_URL = instance.getUri();
}
