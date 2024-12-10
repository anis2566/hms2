import { Metadata } from "next"
import Link from "next/link"

import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { BrandList } from "@/features/dashboard/brand/components/brand-list"

export const metadata: Metadata = {
    title: "Dashboard | Brand",
    description: "Brand",
}

const Brand = async () => {
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
                        <BreadcrumbPage>Brand</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <BrandList />
        </ContentLayout>
    )
}

export default Brand
