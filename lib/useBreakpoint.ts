import { useState, useEffect } from 'react';

const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

export function useBreakpoint(breakpoint: keyof typeof breakpoints) {
    const [isAboveBreakpoint, setIsAboveBreakpoint] = useState(false);

    useEffect(() => {
        const checkBreakpoint = () => {
            setIsAboveBreakpoint(window.innerWidth >= breakpoints[breakpoint]);
        };

        // Check on mount
        checkBreakpoint();

        // Add event listener
        window.addEventListener('resize', checkBreakpoint);

        // Cleanup
        return () => window.removeEventListener('resize', checkBreakpoint);
    }, [breakpoint]);

    return isAboveBreakpoint;
}