import { Message } from "ai";
import { InferSelectModel } from "drizzle-orm";
import { pgTable, varchar, timestamp, json, uuid, text } from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  sub: varchar("sub", { length: 64 }),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  messages: json("messages").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export type Chat = Omit<InferSelectModel<typeof chat>, "messages"> & {
  messages: Array<Message>;
};

export const journal = pgTable("Journal", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  userId: uuid("userId").notNull().references(() => user.id),
  entryText: text("entryText").notNull()
});

export type Journal = InferSelectModel<typeof journal>;

export const analysis = pgTable("Analysis", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  journalId: uuid("journalId").notNull().references(() => journal.id),
  analysisText: text("analysisText").notNull(),
});

export type Analysis = InferSelectModel<typeof analysis>;
