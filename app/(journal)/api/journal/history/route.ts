import { auth } from "@/app/(auth)/auth";
import { getJournalEntriesByUserId } from "@/db/queries";

export async function GET() {
    const session = await auth();

    if (!session || !session.user) {
        return Response.json("Unauthorized!", { status: 401 });
    }

    const journalEntries = await getJournalEntriesByUserId({ id: session.user.id! });
    return Response.json(journalEntries);
}
