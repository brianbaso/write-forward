import Link from "next/link";

import { auth, signOut } from "@/app/(auth)/auth";

import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { HiMiniUser } from "react-icons/hi2";

import { SidebarMenu } from "./sidebar-menu";
import Logo from "./logo";

export const Navbar = async () => {
  let session = await auth();

  return (
    <>
      <div className="bg-gray-900 absolute top-0 left-0 w-dvw py-2 px-3 justify-between flex flex-row items-center z-30">
        <div className="flex flex-row gap-3 items-center">
          <SidebarMenu user={session?.user} />
          <div className="flex flex-row gap-2 items-center">
            <Logo />
          </div>
        </div>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage alt="Avatar" />
                <AvatarFallback><HiMiniUser className="w-6 h-6" /></AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{session.user?.email}</DropdownMenuItem>
              <DropdownMenuItem>
                <ThemeToggle />
              </DropdownMenuItem>
              <DropdownMenuItem className="p-1 z-50">
                <form
                  className="w-full"
                  action={async () => {
                    "use server";

                    await signOut({
                      redirectTo: "/",
                    });
                  }}
                >
                  <button
                    type="submit"
                    className="w-full text-left px-1 py-0.5 text-red-500"
                  >
                    Sign out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="py-1.5 px-2 h-fit font-normal" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </>
  );
};
