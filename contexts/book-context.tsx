"use client";

import { createContext, useContext } from 'react';
import { getBookInfo } from '@/lib/api';

interface BookContextType {
    fetchBookData: (title: string, author: string) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: React.ReactNode }) {
    const fetchBookData = async (title: string, author: string) => {
        try {
            const data = await getBookInfo(title, author);
            return data;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    };

    return (
        <BookContext.Provider
            value={{
                fetchBookData,
            }}
        >
            {children}
        </BookContext.Provider>
    );
}

export function useBookContext() {
    const context = useContext(BookContext);
    if (context === undefined) {
        throw new Error('useBookContext must be used within a BookProvider');
    }
    return context;
}