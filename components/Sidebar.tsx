"use client";

import {
  LayoutDashboard,
  FileText,
  Pencil,
  Settings2,
  ChevronRight,
  ChevronsUpDown,
  User,
  Share,
  LogOut,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "./ui/breadcrumb";
import LogOutButton from "./Signout";

const data = {
  navMain: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Posts",
      icon: FileText,
    },
    {
      title: "Create Post",
      icon: Pencil,
    },
    {
      title: "Settings",
      icon: Settings2,
    }
  ],
};

export default function BloggingSidebar({ children } : { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <SidebarProvider>
      <Sidebar
        variant="inset"
        className="fixed top-0 left-0 h-auto w-64 border-r bg-gray-50 shadow-lg z-10"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/home">
                  <div className="flex aspect-square items-center justify-center rounded-lg bg-white">     
                      <img src="/blogify.png" alt="website icon" className="h-6 w-6" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className=" font-semibold text-lg">Blogging App</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              {data.navMain.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton size="lg">
                    <item.icon className="size-4" />
                    <span className="">{item.title}</span>
                    <ChevronRight className="ml-auto size-4" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarGroup>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        U
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className=" font-semibold">
                        {session?.user.name}
                      </span>
                      <span className=" text-xs">
                        {session?.user.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share /> Share Blog
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <LogOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
