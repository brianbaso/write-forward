'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';

import { Analysis } from "@/components/custom/analysis";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function EntryPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, error, isLoading } = useSWR(`/api/journal/${id}`, async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journal/${id}`);
        if (!response.ok) throw new Error('Failed to fetch journal and analysis');
        return response.json();
    }, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    const parseAnalysisContent = (content: string) => {
        const titleMatch = content.match(/^Title: (.+)$/m);
        const titleIndex = content.indexOf('Title:');
        const nextLineIndex = content.indexOf('\n', titleIndex);

        return {
            title: titleMatch?.[1] || 'Analysis',
            content: nextLineIndex > -1 ? content.slice(nextLineIndex + 1).trim() : content
        };
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-24 md:pt-40">
            <div className="w-[90%] lg:w-1/2 text-zinc-300 bg-gray-800 rounded-lg px-8 pt-8 mb-4">
                <h1 className="text-2xl font-bold text-center pb-5 font-libre-baskerville">Journal Entry</h1>

                {isLoading ? (
                    <div className="space-y-3 mb-4">
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4"></div>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap mb-4">
                        {data?.Journal && data.Journal.entryText}
                    </div>
                )}

                <Accordion type="single" collapsible className="w-full mb-4">
                    <AccordionItem value="analysis">
                        <AccordionTrigger className="text-zinc-300">
                            View Analysis
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-300">
                            {error ? (
                                <p className="text-red-400">Failed to load analysis</p>
                            ) : data?.Analysis === null ? (
                                <p>No analysis found</p>
                            ) : !data?.Analysis ? (
                                <p>Loading analysis...</p>
                            ) : (
                                <Analysis
                                    title={parseAnalysisContent(data.Analysis.analysisText).title}
                                    content={parseAnalysisContent(data.Analysis.analysisText).content}
                                    isLoading={false}
                                />
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
} 