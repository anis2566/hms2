import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/features/dashboard/components/content-layout";
import { DashboardPage } from "@/features/dashboard/components/dashboard-page";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "TomarSports Dashboard",
};

const Dashboard = () => {
    return (
        <ContentLayout title="Dashboard">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <DashboardPage />
        </ContentLayout>
    )
};

export default Dashboard;