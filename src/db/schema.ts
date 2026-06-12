import {
  pgTable,
  serial,
  integer,
  date,
  timestamp,
  boolean,
  varchar,
  text,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. Users Table (Identity & Streaks)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name").notNull(),
  email: varchar("email"),
  passwordHash: varchar("password_hash").notNull(),
  role: varchar("role").notNull(),
  currentStreak: integer("current_streak"),
  highestStreak: integer("highest_streak"),
  lastActivityDate: timestamp("last_activity_date"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at"),
});

// 2. Attendance/Logs Table (The Core Gateway)
export const attendanceLogs = pgTable("daily_attendance_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  logDate: date("log_date").notNull(),
  arrivalTime: timestamp("arrival_time"),
  isLate: boolean("is_late").default(false),
  isOnSite: boolean("is_on_site").default(true),
  dayName: varchar("day_name"),
  isLogEmpty: boolean("is_log_empty").default(true),

  // Core project info (Every role has a project/task title and description)
  projectTitle: varchar("project_title"),
  projectDescription: text("project_description"),

  // THE DYNAMIC ENGINE: Polymorphic storage for role-specific tools, stacks, or references
  workData: jsonb("work_data"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
