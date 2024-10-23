'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AnalysisContextType {
    analysis: string;
    setAnalysis: (analysis: string) => void;
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
        // Try to load analysis from localStorage on initial render
        if (typeof window !== 'undefined') {
            return localStorage.getItem('analysis') || '';
        }
        return '';
    });

    const updateAnalysis = (newAnalysis: string) => {
        setAnalysis(newAnalysis);
        // Save to localStorage whenever analysis is updated
        if (typeof window !== 'undefined') {
            localStorage.setItem('analysis', newAnalysis);
        }
    };

    return (
        <AnalysisContext.Provider value={{ analysis, setAnalysis: updateAnalysis }}>
            {children}
        </AnalysisContext.Provider>
    );
};
