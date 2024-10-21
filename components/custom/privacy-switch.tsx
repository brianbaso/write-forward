import { Switch } from "@/components/ui/switch"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface PrivacySwitchProps {
    privacyMode: boolean;
    setPrivacyMode: (value: boolean) => void;
}

export default function PrivacySwitch({ privacyMode, setPrivacyMode }: PrivacySwitchProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="privacy-mode"
                            checked={privacyMode}
                            onCheckedChange={setPrivacyMode}
                        />
                        <label htmlFor="privacy-mode" className="text-zinc-400 text-sm">
                            {privacyMode ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                        </label>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Darkens text for privacy when writing in public.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

