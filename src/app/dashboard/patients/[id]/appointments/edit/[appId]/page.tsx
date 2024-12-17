import { Metadata } from "next";

import { EditAppointmentForm } from "@/features/dashboard/patients/components/edit-appointment-form";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Dashboard | Patient | Edit Appointment",
    description: "Add a edit appointment for the patient",
};

interface Props {
    params: Promise<{ id: string, appId: string }>
}


const EditAppointMent = async ({ params }: Props) => {
    const { appId, id } = (await params)

    const appointment = await db.appointment.findUnique({
        where: {
            id: appId
        }
    })

    if (!appointment) redirect(`/dashboard/patients/${id}`)

    return <EditAppointmentForm appointment={appointment} />;
};

export default EditAppointMent;

