"use client";

import { Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { useGetRecentAppointments } from "../api/use-get-recent-appointments";
import { APPOINTMENT_STATUS } from "@/constant";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentAppoinments() {
    const { data, isLoading } = useGetRecentAppointments();

    return (
        <Card className="p-2">
            <CardHeader className="p-2">
                <CardTitle>Recent Appoinments</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col p-2">
                {isLoading ? (
                    <AppointMentSkeleton />
                ) : (
                    data?.map((appoinment) => (
                        <div
                            className="grid h-[90px] grid-cols-3 items-center gap-2"
                            key={appoinment.id}
                        >
                            <div className="flex h-full items-center justify-between">
                                <p className="text-center text-sm text-muted-foreground capitalize">
                                    {formatDistanceToNow(new Date(appoinment.date), {
                                        addSuffix: true,
                                    })}
                                </p>
                                <div className="flex h-full flex-col items-center justify-center">
                                    <div className={cn("block h-full w-[2px] bg-muted")} />
                                    <div className={cn(`flex items-center justify-center rounded-full bg-amber-500/10 p-2`, appoinment.status === APPOINTMENT_STATUS.PENDING ? "bg-amber-500/10" : appoinment.status === APPOINTMENT_STATUS.COMPLETED ? "bg-green-500/10" : appoinment.status === APPOINTMENT_STATUS.CONFIRMED ? "bg-blue-500/10" : "bg-red-500/10")}>
                                        <Clock className={cn(`h-4 w-4 text-amber-500`, appoinment.status === APPOINTMENT_STATUS.PENDING ? "text-amber-500" : appoinment.status === APPOINTMENT_STATUS.COMPLETED ? "text-green-500" : appoinment.status === APPOINTMENT_STATUS.CONFIRMED ? "text-blue-500" : "text-red-500")} />
                                    </div>
                                    <div className="block h-full w-[2px] bg-muted" />
                                </div>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <p className="text-sm font-semibold">{appoinment.patient.name}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(appoinment.startTime), "hh:mm a")} - {format(new Date(appoinment.endTime), "hh:mm a")}</p>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}


const AppointMentSkeleton = () => {
    return (
        <div className="space-y-2">
            {
                Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="grid h-[90px] grid-cols-3 items-center gap-2">
                        <div className="flex h-full items-center justify-between">
                            <Skeleton className="h-4 w-2/3 rounded-full" />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Skeleton className="h-4 w-2/6" />
                            <Skeleton className="h-4 w-2/6" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
