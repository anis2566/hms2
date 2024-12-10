import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditBrandForm } from "@/features/dashboard/brand/components/edit-brand-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Brand | Edit",
    description: "Edit Brand",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditFlat = async ({ params }: Props) => {
    const { id } = (await params)

    const brand = await db.brand.findUnique({
        where: {
            id: id
        }
    })

    if (!brand) redirect("/dashboard/brand")

    return (
        <ContentLayout title="Brand">
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
                            <Link href="/dashboard/brand">Brand</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditBrandForm brand={brand} />
        </ContentLayout>
    )
}

export default EditFlat