'use client';
import { useAnalysisContext } from '@/app/context/AnalysisContext';
import ReactMarkdown from 'react-markdown'
import '@/app/styles/markdown-styles.css'
import { useState, useEffect } from 'react';

export default function Analysis() {
    const { analysis } = useAnalysisContext();
    const [title, setTitle] = useState('Analysis');
    const [content, setContent] = useState('');

    useEffect(() => {
        let isMounted = true;

        if (analysis) {
            const titleMatch = analysis.match(/^Title: (.+)$/m);
            if (isMounted) {
                setTitle(titleMatch ? titleMatch[1] : 'Analysis');
                setContent(analysis.replace(/^Title: .+\n/, '').trim());
            }
        }

        return () => {
            isMounted = false;
        };
    }, [analysis]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-40">
            <div className="w-1/2 text-zinc-300 bg-gray-800 rounded-lg p-8 mb-4">
                <h1 className="text-2xl font-bold text-center pb-5 font-libre-baskerville">{title}</h1>
                {content ? (
                    <ReactMarkdown className="markdown-content">{content}</ReactMarkdown>
                ) : (
                    <p>No analysis available</p>
                )}
            </div>
        </div>
    );
}
