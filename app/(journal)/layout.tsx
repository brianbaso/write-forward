"use client";

import { BookProvider } from '@/contexts/book-context';

export default function JournalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <BookProvider>
            {children}
        </BookProvider>
    );
}