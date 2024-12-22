import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { db } from "@/lib/db";
import { EditPaymentForm } from "@/features/dashboard/payments/components/edit-payment-form";
import { ContentLayout } from "@/features/dashboard/components/content-layout";

export const metadata: Metadata = {
    title: "Dashboard | Payment | Edit",
    description: "Edit Doctor",
}

interface Props {
    params: Promise<{ id: string }>
}

const EditPayment = async ({ params }: Props) => {
    const { id } = (await params)

    const payment = await db.payment.findUnique({
        where: {
            id: id
        }
    })

    if (!payment) redirect("/dashboard/payments")

    return (
        <ContentLayout title="Payments">
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
                            <Link href="/dashboard/payments">Payments</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditPaymentForm payment={payment} />
        </ContentLayout>
    )
}

export default EditPayment