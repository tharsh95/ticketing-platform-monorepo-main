import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import * as path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
console.log(connectionString)
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}
// Create the connection
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

export * from './schema';
export { eq } from 'drizzle-orm';
export { seed } from './seed';
