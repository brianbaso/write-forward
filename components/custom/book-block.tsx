import React from 'react';
import { getBookInfo } from '@/lib/api';

const BookBlock = async ({ text }: { text: string }) => {
    if (!text) {
        return null;
    }

    const [title, author] = text.split(',,').map(part => part.trim());

    try {
        const bookInfo = await getBookInfo(title, author);
        console.log(bookInfo);

    } catch (error) {
        console.error('Error fetching book info:', error);
    }


    return (
        <div className="max-w-xl ml-2 md:ml-6 p-2">
            {/* Word */}
            <h1 className="text-2xl mb-2 font-normal font-georgia">
                Books
            </h1>

            {/* Pronunciation */}
            <div className="mb-2 text-gray-400 font-georgia">
                Books
            </div>

            {/* Definition */}
            <div className="text-md leading-relaxed font-serif">
                Books
            </div>
        </div>
    );
};

export default BookBlock;