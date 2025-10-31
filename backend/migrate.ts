// This is the config file for the MongoDB migrations.
export default {
  uri: process.env.DATABASE_URL!,
  collection: 'migrations',
  migrationsPath: './src/db/migrations',
  autosync: false,
};
