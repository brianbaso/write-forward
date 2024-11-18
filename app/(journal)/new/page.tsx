"use client"

import { useState, useEffect, useMemo } from "react"
import { useChat } from "ai/react";
import { Attachment } from 'ai';

import { JOURNAL_PAGE_QUOTES } from '@/constants/Quotes';
import { saveJournalEntry, saveAnalysis, getTextFromImage } from '@/lib/api';
import { Analysis } from "@/components/custom/analysis";
import { MultimodalInput } from "@/components/custom/multimodal-input";

export default function New() {
    const [randomQuote, setRandomQuote] = useState("");
    const [attachments, setAttachments] = useState<Array<Attachment>>([]);
    const [savedJournalId, setSavedJournalId] = useState<string | null>(null);

    const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
        useChat({
            onFinish: async () => {
                const { journalId } = await saveJournalEntry(input);
                setSavedJournalId(journalId);
            },
        });

    useEffect(() => {
        const saveAnalysisIfReady = async () => {
            if (messages.length > 1 && savedJournalId) {
                await saveAnalysis(savedJournalId, messages[1].content);
            }
        };

        saveAnalysisIfReady();
    }, [messages, savedJournalId]);

    useEffect(() => {
        setRandomQuote(JOURNAL_PAGE_QUOTES[Math.floor(Math.random() * JOURNAL_PAGE_QUOTES.length)]);
    }, []);

    const parseAnalysisContent = (content: string) => {
        const titleMatch = content.match(/^Title: (.+)$/m);
        const titleIndex = content.indexOf('Title:');
        const nextLineIndex = content.indexOf('\n', titleIndex);

        return {
            title: titleMatch?.[1] || 'Analysis',
            content: nextLineIndex > -1 ? content.slice(nextLineIndex + 1).trim() : content
        };
    };

    const parsedAnalysis = useMemo(() =>
        messages.length > 1 ? parseAnalysisContent(messages[1].content) : null,
        [messages]
    );

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-40">
                <h1 className='w-[90%] md:w-1/2 text-zinc-400 text-md text-center font-libre-baskerville italic pb-4'>
                    {randomQuote}
                </h1>

                <form className="w-[90%] md:w-1/2 md:px-0">
                    <MultimodalInput
                        input={input}
                        setInput={setInput}
                        handleSubmit={handleSubmit}
                        isLoading={isLoading}
                        stop={stop}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        messages={messages}
                        append={append}
                        isChatPage={false}
                    />
                </form>

                {parsedAnalysis && (
                    <div className="w-[90%] md:w-1/2 flex flex-col items-center pt-6">
                        <h1 className="text-zinc-400 text-md text-center font-libre-baskerville italic pb-4">
                            {parsedAnalysis.title}
                        </h1>
                        <Analysis content={parsedAnalysis.content} />
                    </div>
                )}
            </div >
        </>
    );
}
