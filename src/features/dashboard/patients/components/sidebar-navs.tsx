"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

import { patientSidebarNavs } from "@/constant";
import { cn } from "@/lib/utils";

interface Props {
    patientId: string;
}

export const SidebarNavs = ({ patientId }: Props) => {
    const pathname = usePathname();

    return (
        <div className="space-y-2">
            {patientSidebarNavs.map((nav, index) => {
                const pathArray = pathname.split("/")
                const isActive = nav.href === `/${pathArray[pathArray.length - 1]}`
                return (
                    <Link
                        href={`/dashboard/patients/${patientId}${nav.href}`}
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