import React, { forwardRef, useRef } from "react";
import { FiPaperclip } from "react-icons/fi";

import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImageUploadButtonProps {
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadButton = forwardRef<HTMLButtonElement, ImageUploadButtonProps>(({ handleFileChange }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
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
