"use client"

import { MoreVerticalIcon, RefreshCcw, Trash2 } from "lucide-react"
import Link from "next/link"
import { Edit } from "lucide-react"
import { format } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useGetAppointments } from "../api/use-get-appointments"
import { Badge } from "@/components/ui/badge"
import { APPOINTMENT_STATUS } from "@/constant"
import { useAppointmentStatus, useAppointmentDelete } from "@/hooks/use-appointment"
import { CustomPagination } from "@/components/custom-pagination"
import { EmptyStat } from "@/components/empty-stat"
import { Header } from "./header-list"

export const AppointmentList = () => {
    const { onOpen } = useAppointmentStatus()
    const { onOpen: onOpenDelete } = useAppointmentDelete()
    const { data, isLoading } = useGetAppointments()

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                        List of appointments
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    {
                        isLoading ? <AppointmentListSkeleton /> :
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Doctor</TableHead>
                                        <TableHead>Service</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data?.appointments.map((appointment) => (
                                        <TableRow key={appointment.id}>
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
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar>
                                                        <AvatarImage src={appointment.doctor.imageUrl || ""} />
                                                        <AvatarFallback>{appointment.doctor.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-medium">{appointment.doctor.name}</p>
                                                        <p className="text-sm text-muted-foreground">{appointment.doctor.phone}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{appointment.service.name}</TableCell>
                                            <TableCell>{format(new Date(appointment.date), "dd MMM yyyy")}</TableCell>
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
                                                            <Link href={`/dashboard/appointments/edit/${appointment.id}`} className="flex items-center gap-x-3">
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
                    {!isLoading && data?.appointments.length === 0 && <EmptyStat title="No appointment found" />}
                    <CustomPagination totalCount={data?.totalCount || 0} />
                </CardContent>
            </Card>
        </div>
    )
}



const AppointmentListSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow className="bg-accent hover:bg-accent/80">
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
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
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                        <TableCell><Skeleton className="w-full h-10" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
