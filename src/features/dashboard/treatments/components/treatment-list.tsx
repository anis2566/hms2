"use client";

import { Edit, MoreVerticalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetTreatments } from "@/features/dashboard/treatments/api/use-get-treatments";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useDeleteTreatment } from "@/hooks/use-treatment";
import { Header } from "./header";

export const TreatmentList = () => {
    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { onOpen } = useDeleteTreatment();

    const { data, isLoading } = useGetTreatments();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Treatments</CardTitle>
                <CardDescription>Manage your treatments here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />

                {isLoading ? <TreatmentListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.treatments.map((treatment, index) => (
                                    <TableRow key={treatment.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{treatment.name}</TableCell>
                                        <TableCell>{treatment.description.length > 50 ? treatment.description.slice(0, 50) + "..." : treatment.description}</TableCell>
                                        <TableCell>{format(new Date(treatment.createdAt), "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/treatments/edit/${treatment.id}`} className="flex items-center gap-x-3">
                                                            <Edit className="w-5 h-5" />
                                                            <p>Edit</p>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(treatment.id)}>
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
                {!isLoading && data?.treatments.length === 0 && <EmptyStat title="No treatment found" />}
                <CustomPagination totalCount={data?.totalCount || 0} pageSize={limit} />
            </CardContent>
        </Card>
    )
}


const TreatmentListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
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
