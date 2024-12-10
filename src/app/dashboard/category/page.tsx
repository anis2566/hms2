import { Metadata } from "next"
import Link from "next/link"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { ContentLayout } from "@/features/dashboard/components/content-layout"
import { db } from "@/lib/db"
import { CategoryList } from "@/features/dashboard/category/components/category-list"
import { CustomPagination } from "@/components/custom-pagination"
import { Header } from "@/features/dashboard/category/components/header"

export const metadata: Metadata = {
    title: "Dashboard | Category",
    description: "Category",
}

type SearchParams = Promise<{
    query?: string;
    sort?: "desc" | "asc";
    status?: string;
    page?: string;
    limit?: string;
}>

interface Props {
    searchParams: SearchParams
}

const Category = async ({ searchParams }: Props) => {
    const { query, sort, status, page, limit } = await searchParams;

    const pageNumber = parseInt(page || "1");
    const limitNumber = parseInt(limit || "5");

    const [categories, totalCount] = await Promise.all([
        db.category.findMany({
            where: {
                ...(query && { name: { contains: query, mode: "insensitive" } }),
                ...(status && { status }),
            },
            orderBy: {
                ...(sort === "desc" ? { createdAt: "desc" } : { createdAt: "asc" }),
            },
            skip: (pageNumber - 1) * limitNumber,
            take: limitNumber,
        }),
        db.category.count({
            where: {
                ...(query && { name: { contains: query, mode: "insensitive" } }),
                ...(status && { status }),
            },
        }),
    ]);

    return (
        <ContentLayout title="Category">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Category</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card>
                <CardHeader>
                    <CardTitle>Category</CardTitle>
                    <CardDescription>Manage your categories here</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <CategoryList categories={categories} />
                    <CustomPagination pageSize={limitNumber} totalCount={totalCount} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Category
