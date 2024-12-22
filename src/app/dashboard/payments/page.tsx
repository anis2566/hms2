import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { PaymentList } from "@/features/dashboard/payments/components/payment-list";


export const metadata: Metadata = {
    title: "Dashboard | Payments",
    description: "Payments page",
};

const Payments = () => {
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
                        <BreadcrumbPage>Payments</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Suspense fallback={<div>Loading...</div>}>
                <PaymentList />
            </Suspense>
        </ContentLayout>
    )
};

export default Payments;

