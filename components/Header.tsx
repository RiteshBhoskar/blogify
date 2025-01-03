"use client"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LogOutButton from "./Signout";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Header() {
  const { data : session } = useSession();
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm">
        <Link className="flex items-center justify-center" href="/">
          <Image src="/blogify.png" alt="website icon"  height={30} width={30} />
          <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-200">Blogify</span>
        </Link>
        {session ? 
        <div className="sm:pr-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                <AvatarImage src="/blogImage.avif" alt="user profile" />
                <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>
                    My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        New Post
                        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Drafts
                        <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Published Posts
                        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem>About</DropdownMenuItem>
                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <LogOutButton />
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
        :
        <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 transition-colors" href="#features">
          Features
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 transition-colors" href="#about">
          About
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 transition-colors" href="#get-started">
          Contact
        </Link>
      </nav>}
      </header>
    )
}