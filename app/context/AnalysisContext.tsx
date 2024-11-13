'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisContextType {
    analysis: string;
    setAnalysis: (analysis: string) => void;
    entryText: string;
    setEntryText: (text: string) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysisContext = () => {
    const context = useContext(AnalysisContext);
    if (context === undefined) {
        throw new Error('useAnalysisContext must be used within an AnalysisProvider');
    }
    return context;
};

interface AnalysisProviderProps {
    children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
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
        <AnalysisContext.Provider value={{
            analysis,
            setAnalysis: updateAnalysis,
            entryText,
            setEntryText: updateEntryText
        }}>
            {children}
        </AnalysisContext.Provider>
    );
};
