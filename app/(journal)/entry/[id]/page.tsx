'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';

import { useJournalContext } from '@/app/context/JournalContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function EntryPage() {
    const params = useParams();
    const id = params.id as string;
    const { entryText = '' } = useJournalContext();

    const { data: analysis, error } = useSWR(`/api/analysis/${id}`, async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/${id}`);
        if (!response.ok) throw new Error('Failed to fetch analysis');
        return response.json();
    });

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-24 md:pt-40">
            <div className="w-[90%] md:w-1/2 text-zinc-300 bg-gray-800 rounded-lg px-8 pt-8 mb-4">
                <h1 className="text-2xl font-bold text-center pb-5 font-libre-baskerville">Journal Entry</h1>
                <div className="whitespace-pre-wrap mb-4">
                    {entryText ?? ''}
                </div>

                <Accordion type="single" collapsible className="w-full mb-4">
                    <AccordionItem value="analysis">
                        <AccordionTrigger className="text-zinc-300">
                            View Analysis
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-300">
                            {error ? (
                                <p className="text-red-400">Failed to load analysis</p>
                            ) : !analysis ? (
                                <p>Loading analysis...</p>
                            ) : (
                                <div className="whitespace-pre-wrap text-base">
                                    <h1 className="text-xl font-bold text-center pt-3 pb-5 font-libre-baskerville">
                                        {analysis.analysisText.match(/^Title: (.+)$/m)?.[1] || 'Analysis'}
                                    </h1>
                                    {analysis.analysisText.replace(/^Title: .+\n/, '').trim()}
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
} 