"use client";

import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetGenerics } from "@/features/dashboard/medicines/api/use-get-generics";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useUpdateGeneric, useDeleteGeneric } from "@/hooks/use-generic";
import { Header } from "../../treatments/components/header";

export const GenericList = () => {
    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { onOpen } = useUpdateGeneric();
    const { onOpen: onOpenDelete } = useDeleteGeneric();

    const { data, isLoading } = useGetGenerics();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generics</CardTitle>
                <CardDescription>Manage your generics here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />

                {isLoading ? <GenericListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Medicines</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.generics.map((generic, index) => (
                                    <TableRow key={generic.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{generic.name}</TableCell>
                                        <TableCell>{generic?.description && generic.description.length > 50 ? generic.description.slice(0, 50) + "..." : generic.description}</TableCell>
                                        <TableCell>{generic.medicines.length}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(generic.id, { name: generic.name, description: generic.description || undefined })}>
                                                        <Edit className="w-5 h-5" />
                                                        <p>Edit</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(generic.id)}>
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
                {!isLoading && data?.generics.length === 0 && <EmptyStat title="No generic found" />}
                <CustomPagination totalCount={data?.totalCount || 0} pageSize={limit} />
            </CardContent>
        </Card>
    )
}


const GenericListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>#</TableHead>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
