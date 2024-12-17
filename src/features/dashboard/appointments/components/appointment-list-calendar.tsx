"use client"

import { Appointment, Patient, Service } from "@prisma/client"
import { Calendar } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

import { useAppointmentView } from "@/hooks/use-appointment"
import { cn } from "@/lib/utils"
import { WEEK_DAYS } from "@/constant"
import { useGetAppointmentsCalender } from "../api/use-get-appointments-calendar"
import { Header } from "./header"

interface AppointmentWithRelation extends Appointment {
    patient: Patient
    service: Service
}

type AppointmentData = {
    name: string;
    count: number;
    appointments: AppointmentWithRelation[];
};

type AppointmentsByDate = {
    date: string
    count: number
    appointments: AppointmentData[]
}[]

export const AppointmentListCalendar = () => {
    const searchParams = useSearchParams()
    const month = searchParams.get("month")

    const { onOpen } = useAppointmentView()

    const { data, isLoading } = useGetAppointmentsCalender()

    const startDayIndex = month ? new Date(month).getDay() : new Date().getDay()

    console.log(startDayIndex)

    const paddedAppointments = [
        ...Array(startDayIndex).fill(null),
        ...(data?.appointments || []),
    ] as (AppointmentsByDate[number] | null)[];

    console.log(paddedAppointments)

    return (
        <div className="space-y-2">
            <Header />
            <div className="grid md:grid-cols-7 gap-2">
                {
                    WEEK_DAYS.map((day, index) => (
                        <div key={index} className="text-center border p-2">
                            <p className="text-sm font-bold">{day}</p>
                        </div>
                    ))
                }
            </div>
            {isLoading ? <AppointmentListSkeleton /> : (
                <div className="grid md:grid-cols-7 gap-2">
                    {
                        paddedAppointments.map((item, index) => (
                            item === null ? (
                                <div key={index} className="w-full border-[1px] border-gray-200 p-2 min-h-[100px]">
                                </div>
                            ) : (
                                <div key={index} className={cn("w-full border-[1px] border-gray-200 p-2 min-h-[100px] hover:bg-gray-100/60 space-y-2", item.date === new Date().toLocaleDateString("en-US") ? "bg-gray-100" : "")}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <Badge variant={item.count === 0 ? "outline" : "default"} className="text-xs">
                                                {item.count}
                                            </Badge>
                                        </div>
                                        <p className="text-sm font-medium">{((index + 1) - startDayIndex).toString().padStart(2, "0")}</p>
                                    </div>
                                    {
                                        item.appointments.map((appointment, index) => (
                                            <div key={index} className="flex items-center justify-between gap-x-2 cursor-pointer hover:underline" onClick={() => onOpen(appointment.appointments)}>
                                                <p className="text-sm font-medium truncate">{appointment.name}</p>
                                                <p className="text-sm font-bold">{appointment.count}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            )
                        ))
                    }
                </div>
            )}
        </div>
    )
}


const AppointmentListSkeleton = () => {
    return (
        <div className="grid md:grid-cols-7 gap-2">
            {Array.from({ length: 30 }).map((_, index) => (
                <div key={index} className="w-full border-[1px] border-gray-200 p-2 min-h-[100px]">
                    <Skeleton className="w-full h-full" />
                </div>
            ))}
        </div>
    )
}
