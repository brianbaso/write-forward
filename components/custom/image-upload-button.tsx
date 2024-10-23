import React, { forwardRef, useRef } from "react";
import { FiPaperclip } from "react-icons/fi";

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getTextFromImage } from "@/lib/api";

interface ImageUploadButtonProps {
    handleSubmit: (text: string) => void;
    setIsLoading: (isLoading: boolean) => void;
}

const ImageUploadButton = forwardRef<HTMLButtonElement, ImageUploadButtonProps>(({ handleSubmit, setIsLoading }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await getTextFromImage(formData);

            if (res?.text) {
                handleSubmit(res.text);
            } else {
                console.error('Error getting text from image');
            }

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <Button ref={ref} variant="journal" onClick={handleButtonClick}>
                            <FiPaperclip className="text-lg" />
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Upload an image of your journal entry.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
});

ImageUploadButton.displayName = 'ImageUploadButton';

export default ImageUploadButton;
