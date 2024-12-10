"use client"

import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { EmptyStat } from "@/components/empty-stat"
import { useDeleteBrand } from "@/hooks/use-brand"
import { useGetBrand } from "../api/use-get-brand"
import { Header } from "../../category/components/header"
import { CustomPagination } from "@/components/custom-pagination"

export const BrandList = () => {
    const { onOpen } = useDeleteBrand()

    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { data, isLoading } = useGetBrand()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Brand</CardTitle>
                <CardDescription>Manage your brands here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {isLoading ? <BrandListSkeleton /> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.brands.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={brand.imageUrl || ""} />
                                            <AvatarFallback>{brand.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>{brand.name}</TableCell>
                                    <TableCell>{5}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVerticalIcon className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/brand/edit/${brand.id}`} className="flex items-center gap-x-3">
                                                        <Edit className="w-5 h-5" />
                                                        <p>Edit</p>
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(brand.id)}>
                                                    <Trash2 className="w-5 h-5 group-hover:text-rose-600" />
                                                    <p className="group-hover:text-rose-600">Delete</p>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {!isLoading && data?.brands.length === 0 && <EmptyStat title="No brands found" />}
                <CustomPagination pageSize={limit} totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


export const BrandListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
