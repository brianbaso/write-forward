"use client";
import { PencilEditIcon } from "@/components/custom/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const { data: entries, isLoading } = useSWR("/api/journal/history", fetcher, {
        fallbackData: [],
    });
    const isLg = useBreakpoint('lg');

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-20">
            <h1 className="text-3xl">🪷</h1>
            <h1 className="text-3xl font-bold">good afternoon.</h1>
            <Button
                className="font-medium bg-zinc-200 dark:bg-zinc-300 text-md flex justify-start flex-row mt-3"
                asChild
            >
                <Link href="/new">
                    <PencilEditIcon size={16} />
                    <div className="ml-3">New Journal Entry</div>
                </Link>
            </Button>
            <div className="h-[1px] bg-zinc-300 dark:bg-zinc-400 my-6 w-[75%] md:w-[50%]" />

            {isLoading ? (
                <div className="flex flex-col w-[90%] gap-2">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="w-full bg-zinc-300 border-none">
                            <CardContent className="pt-3">
                                <div className="h-4 bg-gray-400 rounded w-24 mb-2 animate-pulse" />
                                <div className="h-12 bg-gray-400 rounded w-full animate-pulse" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                entries.map((entry: any) => (
                    <Link
                        key={entry.id}
                        href={`/entry/${entry.id}?text=${encodeURIComponent(entry.entryText)}`}
                        className="w-[90%] md:min-w-[725px] md:w-[50%]"
                    >
                        <Card className="md:h-[100px] bg-zinc-300 border-none hover:bg-zinc-400 transition-colors mb-2">
                            <CardContent className="pt-3">
                                <div className="text-xs text-gray-700 mb-1">
                                    {new Date(entry.createdAt).toLocaleString()}
                                </div>
                                <p className="text-gray-800 text-sm leading-tight">
                                    {entry.entryText.length > (isLg ? 320 : 150)
                                        ? `${entry.entryText.substring(0, isLg ? 320 : 150)}...`
                                        : entry.entryText}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            )}
        </div>
    );
} 