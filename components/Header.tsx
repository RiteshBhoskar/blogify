import { authOptions } from "@/lib/auth";
import { Pencil } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import LogOutButton from "./Logout";

export default async function Header() {
    const session = await getServerSession(authOptions);
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white dark:bg-gray-800 sticky top-0 z-50 shadow-sm">
        <Link className="flex items-center justify-center" href="#">
          <Pencil className="h-6 w-6 text-gray-800 dark:text-gray-200" />
          <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-gray-200">Blogify</span>
        </Link>
        {session ? 
        <div className="pr-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
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
        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 transition-colors" href="#">
          Features
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 transition-colors" href="#">
          About
        </Link>
        <Link className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50 transition-colors" href="#">
          Contact
        </Link>
      </nav>}
      </header>
    )
}