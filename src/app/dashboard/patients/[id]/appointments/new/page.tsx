import { AppointmentForm } from "@/features/dashboard/patients/components/appointment-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard | Patient | New Appointment",
    description: "Add a new appointment for the patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const NewAppointment = async ({ params }: Props) => {
    const { id } = (await params)
    return <AppointmentForm patientId={id} />;
};

export default NewAppointment;

