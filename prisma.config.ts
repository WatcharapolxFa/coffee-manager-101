import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Migrations are authored against the local SQLite file (prisma migrate dev).
// Turso gets the same SQL through `npm run db:deploy` (scripts/migrate-turso.mjs).
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: 'file:./dev.db' },
});
