import { MoreVerticalIcon, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Props {
    patientId: string
}

const appointments = [
    {
        id: "1",
        date: new Date(),
        doctor: "Dr. John Doe",
        time: "10:00 AM",
        status: "Pending",
    },
    {
        id: "2",
        date: new Date(),
        doctor: "Dr. Jane Smith",
        time: "11:00 AM",
        status: "Confirmed",
    },
    {
        id: "3",
        date: new Date(),
        doctor: "Dr. Emily Johnson",
        time: "1:00 PM",
        status: "Cancelled",
    },
    {
        id: "4",
        date: new Date(),
        doctor: "Dr. Michael Brown",
        time: "2:00 PM",
        status: "Pending",
    },
    {
        id: "5",
        date: new Date(),
        doctor: "Dr. Sarah Wilson",
        time: "3:00 PM",
        status: "Completed",
    }
]

export const AppointmentList = ({ patientId }: Props) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointments</CardTitle>
                <CardDescription>List of appointments of patient</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Doctor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>{format(appointment.date, "MMM dd, yyyy")}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar>
                                            <AvatarImage src={""} />
                                            <AvatarFallback>{appointment.doctor.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium">{appointment.doctor}</p>
                                            <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className="rounded-full">
                                        {appointment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVerticalIcon className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="flex items-center gap-x-3">
                                                <Eye className="w-5 h-5" />
                                                <p>View</p>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/patients/${patientId}/appointments/edit/${appointment.id}`} className="flex items-center gap-x-3">
                                                    <Edit className="w-5 h-5" />
                                                    <p>Edit</p>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-x-3 text-rose-500 group">
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
            </CardContent>
        </Card>
    )
}