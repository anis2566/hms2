import { Metadata } from "next";

import { PatientList } from "@/features/dashboard/doctors/components/patient-list";

export const metadata: Metadata = {
    title: "Dashboard | Doctor | Patients",
    description: "Patients of Doctor",
};

interface Props {
    params: Promise<{ id: string }>
}


const Patients = async ({ params }: Props) => {
    const { id } = (await params)
    return <PatientList doctorId={id} />

};

export default Patients;

