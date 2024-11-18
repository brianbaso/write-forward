"server-only";

import { genSaltSync, hashSync } from "bcrypt-ts";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { user, chat, User, journal, analysis } from "./schema";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle
let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

export async function saveChat({
  id,
  messages,
  userId,
}: {
  id: string;
  messages: any;
  userId: string;
}) {
  try {
    const selectedChats = await db.select().from(chat).where(eq(chat.id, id));

    if (selectedChats.length > 0) {
      return await db
        .update(chat)
        .set({
          messages: JSON.stringify(messages),
        })
        .where(eq(chat.id, id));
    }

    return await db.insert(chat).values({
      id,
      createdAt: new Date(),
      messages: JSON.stringify(messages),
      userId,
    });
  } catch (error) {
    console.error("Failed to save chat in database");
    throw error;
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    return await db.delete(chat).where(eq(chat.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function getChatsByUserId({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(chat)
      .where(eq(chat.userId, id))
      .orderBy(desc(chat.createdAt));
  } catch (error) {
    console.error("Failed to get chats by user from database");
    throw error;
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
    return selectedChat;
  } catch (error) {
    console.error("Failed to get chat by id from database");
    throw error;
  }
}

export async function saveJournalEntry({ id, entryText, userId }: { id: string, entryText: string, userId: string }) {
  try {
    return await db.insert(journal).values({ id, createdAt: new Date(), userId, entryText });
  } catch (error) {
    console.error("Failed to save journal entry in database");
    throw error;
  }
}

export async function getJournalEntriesByUserId({ id }: { id: string }) {
  try {
    return await db.select().from(journal).where(eq(journal.userId, id)).orderBy(desc(journal.createdAt));
  } catch (error) {
    console.error("Failed to get journal entries by user from database");
    throw error;
  }
}

export async function updateJournalEntry({ id, entryText }: { id: string, entryText: string }) {
  try {
    return await db.update(journal).set({ entryText }).where(eq(journal.id, id));
  } catch (error) {
    console.error("Failed to update journal entry in database");
    throw error;
  }
}

export async function deleteJournalEntry({ id }: { id: string }) {
  try {
    return await db.delete(journal).where(eq(journal.id, id));
  } catch (error) {
    console.error("Failed to delete journal entry in database");
    throw error;
  }
}

export async function saveAnalysis({ id, analysisText, journalId }: { id: string, analysisText: string, journalId: string }) {
  try {
    return await db.insert(analysis).values({ id, analysisText, journalId });
  } catch (error) {
    console.error("Failed to save analysis in database");
    throw error;
  }
}

export async function updateAnalysis({ id, analysisText }: { id: string, analysisText: string }) {
  try {
    return await db.update(analysis).set({ analysisText }).where(eq(analysis.id, id));
  } catch (error) {
    console.error("Failed to update analysis in database");
    throw error;
  }
}

export async function getJournalAndAnalysisByJournalId({ id }: { id: string }) {
  try {
    return await db.select().from(journal).leftJoin(analysis, eq(journal.id, analysis.journalId)).where(eq(journal.id, id));
  } catch (error) {
    console.error("Failed to get journal and analysis by journal id from database");
    throw error;
  }
}


export async function getAnalysisByJournalId({ journalId }: { journalId: string }) {
  try {
    return await db.select().from(analysis).where(eq(analysis.journalId, journalId));
  } catch (error) {
    console.error("Failed to get analysis by journal id from database");
    throw error;
  }
}