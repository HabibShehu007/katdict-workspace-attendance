// src/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";

// This gives you a typed 'db' object to use in your API functions
export const db = drizzle(neon(process.env.DATABASE_URL!), { schema });
