"use client";

import { format } from "date-fns";
import { EyeIcon, TrashIcon } from "lucide-react";

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetMedicalRecords } from "../api/use-get-medical-records";
import { CustomPagination } from "@/components/custom-pagination";

interface MedicalRecordsProps {
    patientId: string
}

export const MedicalRecords = ({ patientId }: MedicalRecordsProps) => {
    const { data, isLoading } = useGetMedicalRecords(patientId);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>
                    View all medical records for this patient.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {
                    isLoading ? <MedicalRecordSkeleton /> :
                        data?.medicalRecords.map((record) => (
                            <div key={record.id} className="flex items-center justify-between border border-gray-200 p-4 rounded-xl">
                                <div className="text-sm text-muted-foreground">
                                    {format(record.createdAt, "dd MMM yyyy")}
                                </div>
                                <div className="text-sm space-y-1">
                                    <p className="text-muted-foreground"><span className="font-bold text-black">Complains:</span> {record.complains}</p>
                                    <p className="text-muted-foreground"><span className="font-bold text-black">Diagnosis:</span> {record.diagnosis}</p>
                                    <p className="text-muted-foreground"><span className="font-bold text-black">Treatments:</span> {record.treatments.map((treatment) => treatment.treatment.name).join(", ")}</p>
                                    <p className="text-muted-foreground"><span className="font-bold text-black">Prescription:</span> {record.medicines.map((medicine) => medicine.medicine.name).join(", ")}</p>
                                </div>
                                <div className="text-sm">
                                    (Tsh)
                                    <span className="font-bold text-primary ml-2">
                                        ${
                                            record.medicines.reduce((acc, medicine) => {
                                                return acc + medicine.medicine.price * medicine.quantity
                                            }, 0)
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon">
                                        <EyeIcon className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <TrashIcon className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))
                }
                <CustomPagination totalCount={data?.totalCount || 0} pageSize={3} />
            </CardContent>
        </Card>
    )
}


export const MedicalRecordSkeleton = () => {
    return (
        <div className="space-y-4">
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between border gap-x-4 border-gray-200 p-4 rounded-xl">
                        <div className="text-sm text-muted-foreground flex-1 flex justify-center">
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                        <div className="text-sm space-y-1 flex-1 flex-col items-center">
                            <div className="text-muted-foreground flex w-full gap-x-2">
                                <span className="font-bold text-black">Complains:</span>
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="text-muted-foreground flex w-full gap-x-2">
                                <span className="font-bold text-black">Complains:</span>
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="text-muted-foreground flex w-full gap-x-2">
                                <span className="font-bold text-black">Complains:</span>
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="text-muted-foreground flex w-full gap-x-2">
                                <span className="font-bold text-black">Complains:</span>
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                        <div className="text-sm flex-1 flex justify-center gap-x-3">
                            <span className="text-muted-foreground">(Tsh)</span>
                            <Skeleton className="w-1/4 h-4" />
                        </div>
                        <div className="items-center gap-2 flex-1 flex justify-center">
                            <Skeleton className="w-8 h-8" />
                            <Skeleton className="w-8 h-8" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
