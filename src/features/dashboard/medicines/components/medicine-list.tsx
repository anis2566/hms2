"use client";

import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetMedicine } from "@/features/dashboard/medicines/api/use-get-medicines";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { Header } from "../../treatments/components/header";
import { useDeleteMedicine } from "@/hooks/use-medicine";

export const MedicineList = () => {
    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { onOpen } = useDeleteMedicine();

    const { data, isLoading } = useGetMedicine();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Medicine</CardTitle>
                <CardDescription>Manage your medicine here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />

                {isLoading ? <MedicineListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Generic</TableHead>
                                <TableHead>Manufacturer</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.medicines.map((medicine, index) => (
                                    <TableRow key={medicine.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{medicine.name}</TableCell>
                                        <TableCell>{medicine.generic.name}</TableCell>
                                        <TableCell>{medicine.manufacturer.name}</TableCell>
                                        <TableCell>{medicine.price}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/medicines/edit/${medicine.id}`} className="flex items-center gap-x-3">
                                                            <Edit className="w-5 h-5" />
                                                            <p>Edit</p>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(medicine.id)}>
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
                {!isLoading && data?.medicines.length === 0 && <EmptyStat title="No medicine found" />}
                <CustomPagination totalCount={data?.totalCount || 0} pageSize={limit} />
            </CardContent>
        </Card>
    )
}


const MedicineListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Generic</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Price</TableHead>
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
