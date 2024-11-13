"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useSWR from "swr";

import { useJournalContext } from "@/app/context/JournalContext";
import { PencilEditIcon } from "@/components/custom/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { fetcher } from "@/lib/utils";



export default function HomePage() {
    const { data: entries, isLoading } = useSWR("/api/journal/history", fetcher, {
        fallbackData: [],
    });
    const isLg = useBreakpoint('lg');
    const journalProvider = useJournalContext();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-20">
            <h1 className="text-3xl">🪷</h1>
            <h1 className="text-3xl font-bold">good afternoon.</h1>
            <Button
                className="font-medium bg-gray-800 text-gray-200 hover:bg-gray-700 text-md flex justify-start flex-row mt-3"
                asChild
            >
                <Link href="/new">
                    <PencilEditIcon size={16} />
                    <div className="ml-3">New Journal Entry</div>
                </Link>
            </Button>
            <div className="h-px bg-zinc-300 dark:bg-zinc-400 my-6 w-3/4 md:w-1/2" />
            {isLoading ? (
                <div className="flex flex-col w-[90%] gap-2 justify-center items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="w-full md:min-w-[725px] md:w-1/2 bg-gray-800 border-none">
                            <CardContent className="pt-3">
                                <div className="h-4 bg-gray-600 rounded w-24 mb-2 animate-pulse" />
                                <div className="h-12 bg-gray-600 rounded w-full animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                entries.map((entry: any) => (
                    <div
                        key={entry.id}
                        className="w-[90%] md:min-w-[725px] md:w-1/2 cursor-pointer"
                        onClick={() => {
                            journalProvider.setEntryText(entry.entryText);
                            router.push(`/entry/${entry.id}`);
                        }}
                    >
                        <Card className="md:h-full bg-gray-800 border-none hover:bg-gray-700 transition-colors mb-3 p-1">
                            <CardContent className="pt-3">
                                <div className="text-xs font-medium text-gray-200 mb-1">
                                    {new Date(entry.createdAt).toLocaleString()}
                                </div>
                                <p className="text-gray-300 text-[14px] leading-relaxed">
                                    {entry.entryText.length > (isLg ? 320 : 180)
                                        ? `${entry.entryText.substring(0, isLg ? 320 : 180)}...`
                                        : entry.entryText}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                ))
            )}
        </div>
    );
} 