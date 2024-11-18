import { NextResponse } from 'next/server';

import { getJournalAndAnalysisByJournalId } from '@/db/queries';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        if (!params?.id) {
            return NextResponse.json({ error: 'Journal ID is required' }, { status: 400 });
        }

        const journalAndAnalysis = await getJournalAndAnalysisByJournalId({ id: params.id });

        if (!journalAndAnalysis || journalAndAnalysis.length === 0) {
            return NextResponse.json({ error: 'Journal and analysis not found' }, { status: 404 });
        }

        return NextResponse.json(journalAndAnalysis[0]);
    } catch (error) {
        console.error('Error fetching journal and analysis:', error);
        return NextResponse.json({ error: 'Failed to fetch journal and analysis' }, { status: 500 });
    }
} 