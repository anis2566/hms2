"use client"

import { format } from "date-fns"
import { Calendar, Clock, MessageCircle, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

import { APPOINTMENT_STATUS } from "@/constant"
import { useAppointmentView } from "@/hooks/use-appointment"

export const AppointmentViewModal = () => {
    const { isOpen, appointments, onClose } = useAppointmentView()

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Appointments</DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                        {
                            appointments.map((appointment, index) => (
                                <div key={index} className="flex gap-x-4 border-b pb-4">
                                    <Badge variant="outline" className="max-h-fit">{index + 1}</Badge>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-x-2">
                                            <User className="w-4 h-4" />
                                            <p className="text-sm font-medium">{appointment.patient.name}</p>
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                            <MessageCircle className="w-4 h-4" />
                                            <p className="text-sm font-medium">{appointment.service.name}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2">
                                            <div className="flex items-center gap-x-2">
                                                <Calendar className="w-4 h-4" />
                                                <p className="text-sm font-medium">{format(appointment.date, "dd MMM yyyy")}</p>
                                            </div>
                                            <div className="flex items-center gap-x-2">
                                                <Clock className="w-4 h-4" />
                                                <p className="text-sm font-medium">{format(appointment.startTime, "hh:mm a")} - {format(appointment.endTime, "hh:mm a")}</p>
                                            </div>
                                        </div>
                                        <Badge variant={appointment.status === APPOINTMENT_STATUS.PENDING ? "outline" : appointment.status === APPOINTMENT_STATUS.COMPLETED ? "default" : appointment.status === APPOINTMENT_STATUS.CONFIRMED ? "default" : "destructive"} className="w-fit rounded-full">{appointment.status}</Badge>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}