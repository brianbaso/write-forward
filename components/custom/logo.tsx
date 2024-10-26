import Link from 'next/link';
import React from 'react';

const Logo: React.FC = () => {
    return (
        <Link href="/" className="top-0 left-0 text-gray-200 pl-1 font-bold text-[26px] font-libre-baskerville">
            fwd.
        </Link>
    );
};

export default Logo;
