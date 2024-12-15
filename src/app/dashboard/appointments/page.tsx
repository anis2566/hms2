import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { AppointmentList } from "@/features/dashboard/appointments/components/appointment-list";


export const metadata: Metadata = {
    title: "Dashboard | Appointments",
    description: "Appointments page",
};

const Appointments = () => {
    return (
        <ContentLayout title="Appointments">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Appointments</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <AppointmentList />
        </ContentLayout>
    )
};

export default Appointments;

