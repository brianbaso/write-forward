import { usePathname } from 'next/navigation';
import React from 'react';

const DefinitionBlock = ({ text }: { text: string }) => {
    const pathname = usePathname();
    const isEntryPage = pathname?.startsWith('/entry');

    if (!text) {
        return null;
    }

    const [concept, pronunciation, definition] = text.split(',,').map(part => part.trim());

    return (
        <div className={`bg-white ${isEntryPage ? 'dark:bg-gray-700/50' : 'dark:bg-gray-800'} p-4 rounded-lg my-4 shadow-sm`}>
            <div className="max-w-xl ml-2 md:ml-6 p-2">
                {/* Word */}
                <h1 className="text-2xl mb-2 font-normal font-georgia">
                    {concept?.toLowerCase() || ''}
                </h1>

                {/* Pronunciation */}
                <div className="mb-2 text-gray-400 font-georgia">
                    <span>[{pronunciation}] </span>
                    <span className="italic">noun.</span>
                </div>

                {/* Definition */}
                <div className="text-md leading-relaxed font-serif">
                    <p className="mb-1">
                        {definition}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DefinitionBlock;