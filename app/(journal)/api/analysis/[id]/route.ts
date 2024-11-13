import { NextResponse } from 'next/server';

import { getAnalysisByJournalId } from '@/db/queries';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const analysis = await getAnalysisByJournalId({ journalId: params.id });

        if (!analysis || analysis.length === 0) {
            return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
        }

        return NextResponse.json(analysis[0]);
    } catch (error) {
        console.error('Error fetching analysis:', error);
        return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
    }
} 