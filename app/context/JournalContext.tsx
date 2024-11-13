'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface JournalContextType {
    analysis: string;
    setAnalysis: (analysis: string) => void;
    entryText: string;
    setEntryText: (text: string) => void;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournalContext = () => {
    const context = useContext(JournalContext);
    if (context === undefined) {
        throw new Error('useJournalContext must be used within an JournalProvider');
    }
    return context;
};

interface JournalProviderProps {
    children: ReactNode;
}

export const JournalProvider: React.FC<JournalProviderProps> = ({ children }) => {
    const [analysis, setAnalysis] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('analysis') || '';
        }
        return '';
    });

    const [entryText, setEntryText] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('entryText') || '';
        }
        return '';
    });

    const updateAnalysis = (newAnalysis: string) => {
        setAnalysis(newAnalysis);
        if (typeof window !== 'undefined') {
            localStorage.setItem('analysis', newAnalysis);
        }
    };

    const updateEntryText = (newText: string) => {
        setEntryText(newText);
        if (typeof window !== 'undefined') {
            localStorage.setItem('entryText', newText);
        }
    };

    return (
        <JournalContext.Provider value={{
            analysis,
            setAnalysis: updateAnalysis,
            entryText,
            setEntryText: updateEntryText
        }}>
            {children}
        </JournalContext.Provider>
    );
};
