import { NextRequest, NextResponse } from 'next/server'
import { saveAnalysis } from '@/db/queries';
import { generateUUID } from "@/lib/utils";

import { JOURNAL_ANALYSIS_PROMPT } from '@/constants/Prompts';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(req: NextRequest) {
    const { journalId, entryText } = await req.json();

    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY!,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-3-sonnet-20240229',
                messages: [
                    { role: 'user', content: `${JOURNAL_ANALYSIS_PROMPT}\n\nJournal Entry Text:\n\n ${entryText}` }
                ],
                stream: false,
                max_tokens: 2048,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const analysisText = data.content[0].text;
        const id = generateUUID();

        await saveAnalysis({ id, analysisText, journalId });

        return NextResponse.json({ analysis: analysisText });
    } catch (error) {
        console.error('Create and save analysis API error:', error);
        return NextResponse.json({ error: 'Create and save analysis API error' }, { status: 500 });
    }
}
