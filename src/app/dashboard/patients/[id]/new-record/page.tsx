import { Metadata } from "next";

import { MedicalRecordForm } from "@/features/dashboard/patients/components/medical-record-form";

export const metadata: Metadata = {
    title: "Dashboard | Patient | New Record",
    description: "Add a new medical record for a patient",
};

interface Props {
    params: Promise<{ id: string }>
}


const NewMedicalRecord = async ({ params }: Props) => {
    const { id } = (await params)
    return <MedicalRecordForm patientId={id} />;
};

export default NewMedicalRecord;

