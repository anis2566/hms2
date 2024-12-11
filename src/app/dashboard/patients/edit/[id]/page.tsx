import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditPatientForm } from "@/features/dashboard/patients/components/edit-patient-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Patients | Edit",
    description: "Edit Patient",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditPatient = async ({ params }: Props) => {
    const { id } = (await params)

    const patient = await db.patient.findUnique({
        where: {
            id: id
        }
    })

    if (!patient) redirect("/dashboard/patients")

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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/patients">Patients</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditPatientForm patient={patient} />
        </ContentLayout>
    )
}

export default EditPatient