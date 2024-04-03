import { getServerAuthSession } from "~/server/auth";

import { LogOut } from "lucide-react";
import Profile from "@/components/icons/Profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function Header() {
  const session = await getServerAuthSession();

  return (
    <header className="z-50 flex w-full flex-wrap bg-black py-3 text-sm sm:flex-nowrap sm:justify-start sm:py-0">
      <nav
        className="relative mx-auto w-full px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center justify-between">
          <a
            className="flex-none text-xl font-semibold text-white"
            href="/"
            aria-label="Maintain"
          >
            Maintain
          </a>
        </div>
        <div className="basis-full sm:block">
          <div className="mt-5 flex flex-col gap-x-0 gap-y-4 sm:mt-0 sm:flex-row sm:items-center sm:justify-end sm:gap-x-7 sm:gap-y-0 sm:ps-7">
            {!session?.user && (
              <>
                <a
                  className="font-medium text-white sm:py-6"
                  href="/"
                  aria-current="page"
                >
                  Home
                </a>
                <a
                  className="font-medium text-white/[.8] hover:text-white sm:py-6"
                  href="#"
                >
                  About
                </a>
                <a
                  className="font-medium text-white/[.8] hover:text-white sm:py-6"
                  href="#"
                >
                  Blog
                </a>
              </>
            )}
            {session?.user && (
              <>
                <a
                  className="font-medium text-white/[.8] hover:text-white"
                  href="/"
                  aria-current="page"
                >
                  Routines
                </a>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-x-2 font-medium text-white/[.8] outline-none hover:text-white sm:my-6 sm:border-s sm:border-white/[.3] sm:ps-6">
                      <Profile width={24} height={24} />
                      Profile
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Profile</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <a href="/api/auth/signout">Sign out</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {!session?.user && (
              <a
                className="flex items-center gap-x-2 font-medium text-white/[.8] outline-none hover:text-white sm:my-6 sm:border-s sm:border-white/[.3] sm:ps-6"
                href="/api/auth/signin"
              >
                <Profile width={24} height={24} />
                Sign in
              </a>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
