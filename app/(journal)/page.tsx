import { PencilEditIcon } from "@/components/custom/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
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
            <div className="h-[1px] bg-zinc-300 dark:bg-zinc-400 my-6 w-[75%]" />
            <Card className="w-[90%] bg-zinc-300 border-none hover:bg-[#242830] transition-colors mb-2">
                <CardContent className="pt-3">
                    <div className="text-xs text-gray-700 mb-1">11/2/24 2:28pm</div>
                    <p className="text-gray-800 text-sm leading-tight">
                        Today was unexpectedly productive. Started the morning with a clear mind and managed to tackle the project I've been putting off for...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
} 