import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { TreatmentList } from "@/features/dashboard/treatments/components/treatment-list";


export const metadata: Metadata = {
    title: "Dashboard | Treatments",
    description: "Treatments page",
};

const Treatments = () => {
    return (
        <ContentLayout title="Treatments">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Treatments</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <TreatmentList />
            </Suspense>
        </ContentLayout>
    )
};

export default Treatments;

