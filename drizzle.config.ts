import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// if (!process.env.DATABASE_URL)

export default {
  schema: "./src/lib/supabase/schema.ts",
  out: "./mirgation",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
    ssl: true,
  },
} satisfies Config;
