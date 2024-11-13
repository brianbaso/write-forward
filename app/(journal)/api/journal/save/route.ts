import { NextRequest, NextResponse } from 'next/server'

import { auth } from "@/app/(auth)/auth";
import { saveJournalEntry } from '@/db/queries'
import { generateUUID } from "@/lib/utils";

export async function POST(req: NextRequest) {
    const { entryText } = await req.json();

    const session = await auth();

    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        if (session.user && session.user.id) {
            const id = generateUUID();
            await saveJournalEntry({ id, entryText, userId: session.user.id });
            return NextResponse.json({ journalId: id });
        } else {
            return NextResponse.json({ message: "User ID not found" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error saving journal entry:", error);
        return NextResponse.json({ message: "Failed to save journal entry" }, { status: 500 });
    }
}