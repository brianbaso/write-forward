'use client';

import { useParams } from 'next/navigation';

export default function EntryPage() {
    const params = useParams();
    const id = params.id as string;

    // REFACTOR: Get params.text from context instead of query params

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-24 md:pt-40">
            <div className="w-[90%] md:w-1/2 text-zinc-300 bg-gray-800 rounded-lg p-8 mb-4">
                <h1 className="text-2xl font-bold text-center pb-5 font-libre-baskerville">Journal Entry</h1>
                <div className="whitespace-pre-wrap">
                    {/* The entry text will be passed through searchParams */}
                    {decodeURIComponent(params.text as string)}
                </div>
            </div>
        </div>
    );
} 