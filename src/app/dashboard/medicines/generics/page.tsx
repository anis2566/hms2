import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { NewGenericButton } from "@/features/dashboard/medicines/components/new-generic-button";
import { GenericList } from "@/features/dashboard/medicines/components/generic-list";

export const metadata: Metadata = {
    title: "Dashboard | Medicines | Generics",
    description: "Medicine generics",
};

const Generics = () => {
    return (
        <ContentLayout title="Generics">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/medicines">Medicine</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Generics</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <NewGenericButton />

            <Suspense fallback={<div>Loading...</div>}>
                <GenericList />
            </Suspense>
        </ContentLayout>
    )
};

export default Generics;  
