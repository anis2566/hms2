import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { db } from "@/lib/db";
import { MedicalRecords } from "@/features/dashboard/patients/components/medical-records";

export const metadata: Metadata = {
    title: "Dashboard | Patient",
    description: "Patient details",
};

interface Props {
    params: Promise<{ id: string }>
}

const PatientPage = async ({ params }: Props) => {
    const { id } = await params;

    const patient = await db.patient.findUnique({
        where: {
            id: id
        }
    })

    if (!patient) redirect("/dashboard/patients")

    return (
        <div className="space-y-6">
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild>
                            <Link href={`/dashboard/patients/${id}/new-record`}>
                                <PlusIcon className='w-4 h-4' />
                                Add Medical Record
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                        Add a new medical record
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <MedicalRecords patientId={id} />
        </div>
    );
}

export default PatientPage;
