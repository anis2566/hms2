import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { DoctorList } from "@/features/dashboard/doctors/components/doctor-list";


export const metadata: Metadata = {
    title: "Dashboard | Doctors",
    description: "Doctors page",
};

const Doctors = () => {
    return (
        <ContentLayout title="Doctors">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Doctors</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <DoctorList />
            </Suspense>
        </ContentLayout>
    )
};

export default Doctors;

