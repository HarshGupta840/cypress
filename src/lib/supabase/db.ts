import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../mirgation/schema";
import * as dotenv from "dotenv";
import { migrate } from "drizzle-orm/postgres-js/migrator";
dotenv.config({ path: ".env" });

const client = postgres(process.env.DATABASE_URL as string, { max: 1 });

const db = drizzle(client, { schema });

export const migrateDb = async () => {
  try {
    console.log("🔴 migrating client");
    await migrate(db, { migrationsFolder: "mirgation" });
    console.log("🟢 migrated successfully");
  } catch (error) {
    console.log("🔴 error while migrating", error);
  }
};
// migrateDb();

export default db;
