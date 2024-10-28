"use client"
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from "react"

import ImageUploadButton from "@/components/custom/image-upload-button";
import LoadingEllipsis from '@/components/custom/loading-ellipsis';
import PrivacySwitch from '@/components/custom/privacy-switch';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createAnalysis, getTextFromImage } from '@/lib/api';

import { useAnalysisContext } from '../context/AnalysisContext';
import { Loader2 } from "lucide-react";

export default function Home() {
    const [inputText, setInputText] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isCreatingAnalysis, setIsCreatingAnalysis] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [privacyMode, setPrivacyMode] = useState(false)
    const analysisContext = useAnalysisContext();
    const router = useRouter();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

    const handleSubmit = useCallback(async (text: string) => {
        if (text.trim() === "") {
            setErrorMessage("Please enter some text before submitting.")
            return
        }

        if (!analysisContext || !analysisContext.setAnalysis) {
            console.error("Analysis context not available");
            setErrorMessage("An error occurred. Please try again later.")
            return
        }

        setIsCreatingAnalysis(true)
        try {
            const analysis = await createAnalysis(text)
            analysisContext.setAnalysis(analysis.content[0].text)
            router.push('/analysis');
        } catch (error) {
            console.error("Error creating analysis:", error)
            setErrorMessage("An error occurred while creating the analysis. Please try again.")
            setIsCreatingAnalysis(false)
        }
    }, [analysisContext, router]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey && event.key === "Enter" && !isUploadingImage) {
                event.preventDefault();
                handleSubmit(inputText);
            }
        }

        window.addEventListener("keydown", handleKeyDown)

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [inputText, handleSubmit, isUploadingImage]);  // Added isUploadingImage to dependencies

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsUploadingImage(true);

        if (file) {
            setUploadedFileName(file.name);
        }

        // Create preview URL for the image
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await getTextFromImage(formData);

            if (res?.text) {
                setInputText(res.text);
            } else {
                console.error('Error getting text from image');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <>
            <div className="flex flex-col items-center min-h-screen bg-gray-900 pt-40">
                {isCreatingAnalysis ? (
                    <div className="text-zinc-200 text-center text-xl font-libre-baskerville bg-gray-800 rounded-lg p-6">
                        Crafting Your Analysis<br />
                        <p className="text-4xl pt-2">🧘🏽‍♂️🪷</p>
                        Take a deep breath<LoadingEllipsis />
                    </div>
                ) : (
                    <>
                        {imagePreview ? (
                            <div className="w-1/2 relative bg-gray-800 border-2 border-gray-600 rounded-lg overflow-hidden">
                                <img
                                    src={imagePreview}
                                    alt="Uploaded preview"
                                    className="object-contain w-[100px] h-[140px] opacity-70 mx-auto pb-2 pt-3"
                                />
                                {isUploadingImage && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    </div>
                                )}
                                {/* Add filename display */}
                                <div className="text-zinc-400 text-sm text-center pb-2">
                                    {uploadedFileName && (uploadedFileName.length > 20
                                        ? `${uploadedFileName.substring(0, 20)}...`
                                        : uploadedFileName)}
                                </div>
                            </div>
                        ) : (
                            <Textarea
                                className={`w-1/2 bg-gray-800 border-2 border-gray-600 text-md rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${privacyMode ? 'text-zinc-600 placeholder:text-zinc-600' : 'text-zinc-200 placeholder:text-zinc-500'
                                    }`}
                                placeholder="Write a journal entry..."
                                value={inputText}
                                onChange={(e) => {
                                    setInputText(e.target.value)
                                    setErrorMessage("")
                                }}
                            />
                        )}
                        {errorMessage && (
                            <div className="w-1/2 text-red-500 mt-2">{errorMessage}</div>
                        )}
                        <div className="w-1/2 flex justify-between items-center pt-2">
                            <div className="flex items-center space-x-2">
                                <PrivacySwitch privacyMode={privacyMode} setPrivacyMode={setPrivacyMode} />
                            </div>
                            <div className="flex space-x-2">
                                <ImageUploadButton handleFileChange={handleFileChange} />
                                <Button
                                    variant="journal"
                                    onClick={() => handleSubmit(inputText)}
                                    disabled={isUploadingImage}
                                >
                                    ⌘ + ↵ Submit
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div >
        </>
    );
}
