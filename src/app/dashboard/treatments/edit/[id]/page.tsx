import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditTreatmentForm } from "@/features/dashboard/treatments/components/edit-treatment-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Treatments | Edit",
    description: "Edit Treatment",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditTreatment = async ({ params }: Props) => {
    const { id } = (await params)

    const treatment = await db.treatment.findUnique({
        where: {
            id: id
        }
    })

    if (!treatment) redirect("/dashboard/treatments")

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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/treatments">Treatments</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditTreatmentForm treatment={treatment} />
        </ContentLayout>
    )
}

export default EditTreatment