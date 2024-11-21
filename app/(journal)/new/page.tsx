"use client"

import { Attachment, ChatRequestOptions } from 'ai';
import { useChat } from "ai/react";
import { useState, useEffect, useMemo } from "react"

import { Analysis } from "@/components/custom/analysis";
import { MultimodalInput } from "@/components/custom/multimodal-input";
import { StreamingTextIndicator } from "@/components/custom/streaming-loader";
import { JOURNAL_PAGE_QUOTES } from '@/constants/Quotes';
import { saveJournalEntry, saveAnalysis, getTextFromImage } from '@/lib/api';
import { sanitizeText } from "@/lib/utils";

export default function New() {
    const [randomQuote, setRandomQuote] = useState("");
    const [attachments, setAttachments] = useState<Array<Attachment>>([]);
    const [savedJournalId, setSavedJournalId] = useState<string | null>(null);
    const [showInput, setShowInput] = useState(true);
    const [isInputFading, setIsInputFading] = useState(false);

    const { messages, handleSubmit, input, setInput, append, isLoading, stop } =
        useChat({
            onFinish: async () => {
                const { journalId } = await saveJournalEntry(sanitizeText(input));
                setSavedJournalId(journalId);
            },
        });

    const handleSubmitWithFade = async (event?: { preventDefault?: () => void }, chatRequestOptions?: ChatRequestOptions) => {
        setIsInputFading(true);
        setTimeout(() => {
            setShowInput(false);
            setIsInputFading(false);
        }, 300);
        await handleSubmit(event, chatRequestOptions);
    };

    useEffect(() => {
        const saveAnalysisIfReady = async () => {
            if (messages.length > 1 && savedJournalId) {
                await saveAnalysis(savedJournalId, sanitizeText(messages[1].content));
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
        <div className="min-h-screen bg-gray-900">
            {showInput && (
                <div className={`flex flex-col items-center pt-40 ${isInputFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
                    <h1 className='w-[90%] lg:w-1/2 text-zinc-400 text-md text-center font-libre-baskerville italic pb-4'>
                        {randomQuote}
                    </h1>
                    <form className="w-[90%] lg:w-1/2 md:px-0 transition-opacity duration-500 ease-out" onSubmit={handleSubmitWithFade}>
                        <MultimodalInput
                            input={input}
                            setInput={setInput}
                            handleSubmit={handleSubmitWithFade}
                            isLoading={isLoading}
                            stop={stop}
                            attachments={attachments}
                            setAttachments={setAttachments}
                            messages={messages}
                            append={append}
                            isChatPage={false}
                        />
                    </form>
                </div>
            )}

            {!showInput && (
                <div className="flex flex-col items-center pt-12 md:pt-24">
                    {!parsedAnalysis ? (
                        <div className="pt-12">
                            <StreamingTextIndicator isVisible={true} />
                        </div>
                    ) : (
                        <div className="w-[90%] lg:w-1/2 flex flex-col items-center mt-10 mb-16 animate-fade-in">
                            <Analysis title={parsedAnalysis.title} content={parsedAnalysis.content} isLoading={isLoading} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
