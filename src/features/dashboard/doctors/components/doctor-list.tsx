"use client";

import { Edit, Eye, MoreVerticalIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useGetDoctors } from "../api/use-get-doctors";
import { Header } from "./header";
import { useDeleteDoctor } from "@/hooks/use-doctor";

export const DoctorList = () => {

    const { onOpen } = useDeleteDoctor();
    const searchParams = useSearchParams()
    const limit = parseInt(searchParams.get("limit") || "5")

    const { data, isLoading } = useGetDoctors();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Doctors</CardTitle>
                <CardDescription>Manage your doctors here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />

                {isLoading ? <DoctorListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>#</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.doctors.map((doctor, index) => (
                                    <TableRow key={doctor.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={doctor.imageUrl || ""} />
                                                    <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium">{doctor.name}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{doctor.title}</TableCell>
                                        <TableCell>{doctor.phone}</TableCell>
                                        <TableCell>{doctor.email}</TableCell>
                                        <TableCell>{format(new Date(doctor.createdAt), "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/doctors/${doctor.id}`} className="flex items-center gap-x-3">
                                                            <Eye className="w-5 h-5" />
                                                            <p>View</p>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/doctors/edit/${doctor.id}`} className="flex items-center gap-x-3">
                                                            <Edit className="w-5 h-5" />
                                                            <p>Edit</p>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpen(doctor.id)}>
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
                {!isLoading && data?.doctors.length === 0 && <EmptyStat title="No doctor found" />}
                <CustomPagination totalCount={data?.totalCount || 0} pageSize={limit} />
            </CardContent>
        </Card>
    )
}


const DoctorListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>#</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
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
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
