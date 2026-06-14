import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Point this to your schema file
  out: "./drizzle", // Where migrations will be saved
  dialect: "postgresql", // Since you're using Neon/Postgres
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Ensure this is in your .env file
  },
});
