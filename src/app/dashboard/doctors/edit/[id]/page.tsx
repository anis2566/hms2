import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditDoctorForm } from "@/features/dashboard/doctors/components/edit-doctor-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Doctors | Edit",
    description: "Edit Doctor",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditDoctor = async ({ params }: Props) => {
    const { id } = (await params)

    const doctor = await db.doctor.findUnique({
        where: {
            id: id
        }
    })

    if (!doctor) redirect("/dashboard/doctors")

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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/doctors">Doctors</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditDoctorForm doctor={doctor} />
        </ContentLayout>
    )
}

export default EditDoctor