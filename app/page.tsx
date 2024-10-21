"use client"
import { useState, useEffect, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
// import { createAnalysis } from '../lib/api';
// import { useAnalysisContext } from './context/AnalysisContext';
import { useRouter } from 'next/navigation';

import LoadingEllipsis from '@/components/custom/loading-ellipsis';
import ImageUploadButton from "@/components/custom/image-upload-button";
import PrivacySwitch from '@/components/custom/privacy-switch';

export default function Home() {
    const [inputText, setInputText] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [privacyMode, setPrivacyMode] = useState(false)
    // const analysisContext = useAnalysisContext();
    const router = useRouter();

    const handleSubmit = useCallback(async (text: string) => {
        if (text.trim() === "") {
            setErrorMessage("Please enter some text before submitting.")
            return
        }

        // if (!analysisContext || !analysisContext.setAnalysis) {
        //     console.error("Analysis context not available");
        //     setErrorMessage("An error occurred. Please try again later.")
        //     return
        // }

        setIsLoading(true)
        // try {
        //     const analysis = await createAnalysis(text)
        //     analysisContext.setAnalysis(analysis.content[0].text)
        //     router.push('/analysis');
        // } catch (error) {
        //     console.error("Error creating analysis:", error)
        //     setErrorMessage("An error occurred while creating the analysis. Please try again.")
        //     setIsLoading(false)
        // }
    }, [inputText, router]); // add back analysisContext

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey && event.key === "Enter") {
                event.preventDefault();
                handleSubmit(inputText);
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [handleSubmit]);

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-40">
                {isLoading ? (
                    <div className="text-zinc-200 text-center text-xl font-libre-baskerville bg-gray-800 rounded-lg p-6">
                        Crafting Your Analysis<br />
                        <p className="text-4xl pt-2">🧘🏽‍♂️🪷</p>
                        Take a deep breath<LoadingEllipsis />
                    </div>
                ) : (
                    <>
                        <Textarea
                            className={`w-1/2 bg-gray-800 border-2 border-gray-600 text-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${privacyMode ? 'text-zinc-600 placeholder:text-zinc-600' : 'text-zinc-200 placeholder:text-zinc-500'
                                }`}
                            placeholder="Type here..."
                            value={inputText}
                            onChange={(e) => {
                                setInputText(e.target.value)
                                setErrorMessage("")
                            }}
                        />
                        {errorMessage && (
                            <div className="w-1/2 text-red-500 mt-2">{errorMessage}</div>
                        )}
                        <div className="w-1/2 flex justify-between items-center pt-2">
                            <div className="flex items-center space-x-2">
                                <PrivacySwitch privacyMode={privacyMode} setPrivacyMode={setPrivacyMode} />
                            </div>
                            <div className="flex space-x-2">
                                <ImageUploadButton handleSubmit={handleSubmit} setIsLoading={setIsLoading} />
                                <Button variant="journal" onClick={() => handleSubmit(inputText)}>⌘ + ↵ Submit</Button>
                            </div>
                        </div>
                    </>
                )}
            </div >
        </>
    );
}
