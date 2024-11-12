import { auth } from "@/app/(auth)/auth";
import { getAnalysisByJournalId } from "@/db/queries";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const session = await auth();

    if (!session || !session.user) {
        return Response.json("Unauthorized!", { status: 401 });
    }

    const { journalId } = await req.json();

    const analysis = await getAnalysisByJournalId({ journalId });
    return Response.json(analysis);
}
