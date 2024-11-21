"use client";

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef, memo } from 'react';

import { useBookContext } from '@/contexts/book-context';

const BookBlock = ({ text }: { text: string }) => {
    const { fetchBookData } = useBookContext();
    const [bookData, setBookData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const hasFetched = useRef(false);
    const pathname = usePathname();
    const isEntryPage = pathname?.startsWith('/entry');

    useEffect(() => {
        const loadBookData = async () => {
            if (hasFetched.current) return;
            setIsLoading(true);
            hasFetched.current = true;

            try {
                const [title, author] = text.split(',,').map(part => part.trim());
                if (!title || !author) {
                    return;
                }

                const data = await fetchBookData(title, author);
                setBookData(data);
            } catch (error) {
                console.error('Error fetching book info:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadBookData();
    }, [fetchBookData, text]);

    return (
        <div className={`bg-white ${isEntryPage ? 'dark:bg-gray-700/50' : 'dark:bg-gray-800'} p-4 rounded-lg my-4 shadow-sm`}>
            <div className="w-full p-2 flex flex-col items-center">
                {!isLoading && bookData ? (
                    <>
                        {bookData?.book?.imageLinks?.thumbnail && (
                            <Image
                                src={bookData.book.imageLinks.thumbnail}
                                alt={bookData.book.title || 'Book cover'}
                                width={120}
                                height={192}
                                className="mb-2"
                            />
                        )}
                        {/* Book Data */}
                        <div className="text-md leading-relaxed font-serif">
                            {bookData && `${bookData?.book?.title} by ${bookData?.book?.authors?.[0]}`}
                        </div>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default memo(BookBlock);