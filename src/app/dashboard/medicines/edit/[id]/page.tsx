import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditMedicineForm } from "@/features/dashboard/medicines/components/edit-medicine-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Medicines | Edit",
    description: "Edit Medicine",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditMedicine = async ({ params }: Props) => {
    const { id } = (await params)

    const medicine = await db.medicine.findUnique({
        where: {
            id: id
        }
    })

    if (!medicine) redirect("/dashboard/medicines")

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
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/medicines">Medicine</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditMedicineForm medicine={medicine} />
        </ContentLayout>
    )
}

export default EditMedicine