"use client";

import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetRecentPatients } from "@/features/dashboard/api/use-get-recent-patients";

export function RecentPatients() {
    const { data, isLoading } = useGetRecentPatients();

    return (
        <Card className="p-2">
            <CardHeader className="p-2">
                <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-6 p-2">
                {
                    isLoading ? <PatientSkeleton /> : data?.map((patient, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-x-2">
                                    <Avatar>
                                        <AvatarImage src={patient.imageUrl || ""} />
                                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">{patient.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {patient.phone}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">{format(patient.createdAt, "dd MMM")}</p>
                                    <p className="text-xs text-muted-foreground">{format(patient.createdAt, "hh:mm a")}</p>
                                </div>
                            </div>
                            <Separator />
                        </div>
                    ))
                }
            </CardContent>
        </Card>
    );
}


const PatientSkeleton = () => {
    return (
        <div className="space-y-2">
            {
                Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="w-full flex items-center justify-between gap-x-2">
                        <div className="flex items-center gap-x-2">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col gap-y-1">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
