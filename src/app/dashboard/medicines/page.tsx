import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { MedicineList } from "@/features/dashboard/medicines/components/medicine-list";

export const metadata: Metadata = {
    title: "Dashboard | Medicines",
    description: "Medicine",
};

const Medicines = () => {
    return (
        <ContentLayout title="Medicine">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Medicine</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <MedicineList />
            </Suspense>
        </ContentLayout>
    )
};

export default Medicines;  
