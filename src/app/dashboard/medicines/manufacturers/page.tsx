import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { NewManufacturerButton } from "@/features/dashboard/medicines/components/new-manufacturer-button";
import { ManufacturerList } from "@/features/dashboard/medicines/components/manufacturer-list";

export const metadata: Metadata = {
    title: "Dashboard | Medicines | Manufacturers",
    description: "Medicine manufacturers",
};

const Manufacturers = () => {
    return (
        <ContentLayout title="Manufacturers">
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
                        <BreadcrumbPage>Manufacturers</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <NewManufacturerButton />

            <Suspense fallback={<div>Loading...</div>}>
                <ManufacturerList />
            </Suspense>
        </ContentLayout>
    )
};

export default Manufacturers;  
