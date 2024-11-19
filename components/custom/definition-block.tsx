import React from 'react';

const DefinitionBlock = ({ text = "" }) => {
    if (!text) {
        return null;
    }

    const [word, rest] = text.split(':').map(part => part.trim());
    const pronunciationMatch = rest?.match(/\{(.*?)\}/);
    const pronunciation = pronunciationMatch ? pronunciationMatch[1] : '';
    const definition = rest?.replace(/\{.*?\}/, '')
        .replace(/\[.*?\]/, '')
        .replace('noun.', '')
        .trim() || '';

    return (
        <div className="max-w-xl ml-6 p-4">
            {/* Word */}
            <h1 className="text-2xl mb-2 font-normal font-georgia">
                {word?.toLowerCase() || ''}
            </h1>

            {/* Pronunciation and part of speech */}
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
    );
};

export default DefinitionBlock;