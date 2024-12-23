"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

import { doctorSidebarNavs } from "@/constant";
import { cn } from "@/lib/utils";

interface Props {
    doctorId: string;
}

export const SidebarNavs = ({ doctorId }: Props) => {
    const pathname = usePathname();

    return (
        <div className="space-y-2">
            {doctorSidebarNavs.map((nav, index) => {
                const pathArray = pathname.split("/")
                const isActive = nav.href === `/${pathArray[pathArray.length - 1]}`
                return (
                    <Link
                        href={`/dashboard/doctors/${doctorId}${nav.href}`}
                        key={index}
                        className={cn(
                            buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                            "flex w-full justify-start gap-x-3",
                        )}
                    >
                        <nav.icon className="h-4 w-4" />
                        {nav.label}
                    </Link>
                );
            })}
        </div>
    );
};