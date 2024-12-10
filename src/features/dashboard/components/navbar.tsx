"use client"

import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

import { UserNav } from "./user-nav";

interface NavbarProps {
    title: string;
}

export function Navbar({ title }: NavbarProps) {
    const { toggleSidebar } = useSidebar()
    return (
        <header className="sticky top-0 z-10 w-full bg-muted/40 shadow backdrop-blur supports-[backdrop-filter]:bg-muted/40 dark:shadow-muted">
            <div className="mx-4 flex h-14 items-center">
                <div className="flex items-center space-x-4">
                    <Button className="h-8" size="icon" onClick={toggleSidebar}>
                        <MenuIcon size={20} />
                    </Button>
                    <h1 className="font-bold">{title}</h1>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {/* <Notification /> */}
                    <UserNav />
                </div>
            </div>
        </header>
    );
}