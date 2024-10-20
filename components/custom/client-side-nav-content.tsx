'use client';

import { usePathname } from "next/navigation";
import { History } from "./history";
import { Session } from "next-auth";

export const ClientSideNavContent = ({ session }: { session: Session | null }) => {
    const pathname = usePathname();

    return (
        <div className="flex flex-row gap-3 items-center">
            {pathname.startsWith('/chat') && <History user={session?.user} />}
            <div className="flex flex-row gap-2 items-center">
                <div className="text-sm dark:text-zinc-300">fwd.</div>
            </div>
        </div>
    );
};
