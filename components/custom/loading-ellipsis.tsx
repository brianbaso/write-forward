import { useState, useEffect } from "react";

const LoadingEllipsis: React.FC = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => {
                if (prevDots.length >= 3) return '';
                return prevDots + '.';
            });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return <span className="inline-block w-[15px]">{dots}</span>;
};

export default LoadingEllipsis;