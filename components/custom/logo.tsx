import React from 'react';
import Link from 'next/link';

const Logo: React.FC = () => {
    return (
        <Link href="/" className="absolute top-0 left-0 pl-5 pt-2 text-white text-[28px] font-libre-baskerville">
            fwd.
        </Link>
    );
};

export default Logo;
