"use client"
import { signOut } from "next-auth/react"
import { DropdownMenuItem, DropdownMenuShortcut } from "./ui/dropdown-menu"
import { LogOut } from "lucide-react"
import { useState } from "react"

export default function LogOutButton(){
    const [ isSigningOut, setIsSigningOut ]= useState(false);
    async function handleSignout(){
        if(isSigningOut) return;
        setIsSigningOut(true);
        await signOut({callbackUrl: "/"});
        setIsSigningOut(false);
    }
    return (
        <DropdownMenuItem>
        <LogOut />
        <button onClick={handleSignout}  disabled={isSigningOut}>
            {isSigningOut ? "Signing Out" : "Sign Out"}
        </button>
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    )
}