"use client"

import { format } from "date-fns";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { Edit, RefreshCcw, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetAppointments } from "../api/use-get-appointments";
import { APPOINTMENT_STATUS } from "@/constant";
import { useAppointmentDelete, useAppointmentStatus } from "@/hooks/use-appointment";
import { EmptyStat } from "@/components/empty-stat";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./header";

interface Props {
    doctorId: string
}

export const AppointmentList = ({ doctorId }: Props) => {
    const { onOpen } = useAppointmentStatus()
    const { onOpen: onOpenDelete } = useAppointmentDelete()

    const { data, isLoading } = useGetAppointments(doctorId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage your appointments here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Header />
                {isLoading ? <AppointmentListSkeleton /> :
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-accent hover:bg-accent/80">
                                <TableHead>Date</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.appointments?.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>{format(new Date(appointment.date), "dd MMM yyyy")}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar>
                                                    <AvatarImage src={appointment.patient.imageUrl || ""} />
                                                    <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-medium">{appointment.patient.name}</p>
                                                    <p className="text-sm text-muted-foreground">{appointment.patient.phone}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{format(new Date(appointment.startTime), "hh:mm a")} - {format(new Date(appointment.endTime), "hh:mm a")}</TableCell>
                                        <TableCell>
                                            <Badge variant={appointment.status === APPOINTMENT_STATUS.PENDING ? "outline" : appointment.status === APPOINTMENT_STATUS.COMPLETED ? "default" : appointment.status === APPOINTMENT_STATUS.CONFIRMED ? "default" : "destructive"} className="w-fit rounded-full">{appointment.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVerticalIcon className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/appointments/edit/${appointment.id}?redirectUrl=/dashboard/doctors/${doctorId}/appointments`} className="flex items-center gap-x-3">
                                                            <Edit className="w-5 h-5" />
                                                            <p>Edit</p>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpen(appointment.id, appointment.status as APPOINTMENT_STATUS)}>
                                                        <RefreshCcw className="w-5 h-5" />
                                                        <p>Change Status</p>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group" onClick={() => onOpenDelete(appointment.id)}>
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
                {!isLoading && data?.appointments?.length === 0 && <EmptyStat title="No appointment found" />}
                <CustomPagination totalCount={data?.totalCount || 0} />
            </CardContent>
        </Card>
    )
};


const AppointmentListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
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