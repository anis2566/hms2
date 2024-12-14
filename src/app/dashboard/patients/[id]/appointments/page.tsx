import { Metadata } from "next";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import { AppointmentList } from "@/features/dashboard/patients/components/appointment-list";

export const metadata: Metadata = {
    title: "Dashboard | Patient | Appointments",
    description: "Appointments for a patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const Appointments = async ({ params }: Props) => {
    const { id } = (await params)
    return (
        <div className="space-y-6">
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild>
                            <Link href={`/dashboard/patients/${id}/appointments/new`}>
                                <PlusIcon className='w-4 h-4' />
                                Add Appointment
                            </Link>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side='top'>
                        Add a new appointment
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <AppointmentList patientId={id} />
        </div>
    )
};

export default Appointments;

