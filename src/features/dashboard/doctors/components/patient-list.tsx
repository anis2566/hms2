"use client";

import { Eye, } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { calculateAge } from "@/lib/utils";
import { CustomPagination } from "@/components/custom-pagination";
import { EmptyStat } from "@/components/empty-stat";
import { useGetPatients } from "../api/use-get-patients";
import { Header } from "@/features/dashboard/doctors/components/header";

interface Props {
    doctorId: string
}

export const PatientList = ({ doctorId }: Props) => {
    const { data, isLoading } = useGetPatients(doctorId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage your patients here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {isLoading ? <PatientListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>#</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Blood Group</TableHead>
                                <TableHead>Age</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.patients?.map((patient, index) => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={patient.imageUrl || ""} />
                                                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium">{patient.name}</p>
                                                    <p className="text-sm text-muted-foreground">{patient.phone}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{format(new Date(patient.createdAt), "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <Badge className="rounded-full">{patient.gender}</Badge>
                                        </TableCell>
                                        <TableCell>{patient.bloodGroup}</TableCell>
                                        <TableCell>{calculateAge(new Date(patient.dob))}</TableCell>
                                        <TableCell>
                                            <Button asChild size="icon" variant="ghost">
                                                <Link href={`/dashboard/patients/${patient.id}`} className="flex items-center gap-x-3">
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                }
                {!isLoading && data?.patients?.length === 0 && <EmptyStat title="No patient found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
}


const PatientListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>#</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Age</TableHead>
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
