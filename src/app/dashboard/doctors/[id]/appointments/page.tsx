import { Metadata } from "next";

import { AppointmentList } from "@/features/dashboard/doctors/components/appointment-list";

export const metadata: Metadata = {
    title: "Dashboard | Doctor | Appointments",
    description: "Appointments of Doctor",
};

interface Props {
    params: Promise<{ id: string }>
}


const Appointments = async ({ params }: Props) => {
    const { id } = (await params)
    return <AppointmentList doctorId={id} />

};

export default Appointments;

