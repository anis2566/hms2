import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { PatientList } from "@/features/dashboard/patients/components/patient-list";


export const metadata: Metadata = {
    title: "Dashboard | Patients",
    description: "Patients page",
};

const Patients = () => {
    return (
        <ContentLayout title="Patients">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Patients</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <PatientList />
            </Suspense>
        </ContentLayout>
    )
};

export default Patients;

