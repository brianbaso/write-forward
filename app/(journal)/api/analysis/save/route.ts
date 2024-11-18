import { NextRequest, NextResponse } from 'next/server'

import { saveAnalysis } from '@/db/queries';
import { generateUUID } from "@/lib/utils";


export async function POST(req: NextRequest) {
    try {
        const { journalId, analysisText } = await req.json();

        if (!journalId || !analysisText) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await saveAnalysis({ id: generateUUID(), analysisText, journalId });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error saving analysis:', error);
        return NextResponse.json(
            { error: 'Failed to save analysis' },
            { status: 500 }
        );
    }
}
