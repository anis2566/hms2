import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditAppointmentForm } from "@/features/dashboard/appointments/components/edit-appointment-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Appointments | Edit",
    description: "Edit Appointment",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditAppointment = async ({ params }: Props) => {
    const { id } = (await params)

    const appointment = await db.appointment.findUnique({
        where: {
            id: id
        }
    })

    if (!appointment) redirect("/dashboard/appointments")

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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/appointments">Appointments</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditAppointmentForm appointment={appointment} />
        </ContentLayout>
    )
}

export default EditAppointment