"use client";

import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useGetManufacturers } from "@/features/dashboard/medicines/api/use-get-manufacturers";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useUpdateManufacturer, useDeleteManufacturer } from "@/hooks/use-manufacturer";
import { Header } from "../../treatments/components/header";

export const ManufacturerList = () => {
    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { onOpen } = useUpdateManufacturer();
    const { onOpen: onOpenDelete } = useDeleteManufacturer();

    const { data, isLoading } = useGetManufacturers();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manufacturers</CardTitle>
                <CardDescription>Manage your manufacturers here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />

                {isLoading ? <ManufacturerListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>#</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Medicines</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.manufacturers.map((manufacturer, index) => (
                                    <TableRow key={manufacturer.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Avatar>
                                                <AvatarImage src={manufacturer.imageUrl || ""} />
                                                <AvatarFallback className="uppercase">{manufacturer.name.slice(0, 2)}</AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{manufacturer.name}</TableCell>
                                        <TableCell>{manufacturer?.description && manufacturer.description.length > 50 ? manufacturer.description.slice(0, 50) + "..." : manufacturer.description}</TableCell>
                                        <TableCell>{manufacturer.medicines.length}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(manufacturer.id, { name: manufacturer.name, description: manufacturer.description || "", imageUrl: manufacturer.imageUrl || null })}>
                                                        <Edit className="w-5 h-5" />
                                                        <p>Edit</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(manufacturer.id)}>
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
                }
                {!isLoading && data?.manufacturers.length === 0 && <EmptyStat title="No manufacturer found" />}
                <CustomPagination totalCount={data?.totalCount || 0} pageSize={limit} />
            </CardContent>
        </Card>
    )
}


const ManufacturerListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>#</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Medicines</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
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
