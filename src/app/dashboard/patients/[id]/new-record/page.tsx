import { Metadata } from "next";

import { MedicalRecordForm } from "@/features/dashboard/patients/components/medical-record-form";

export const metadata: Metadata = {
    title: "Dashboard | Patient | New Record",
    description: "Add a new medical record for a patient",
};

const NewMedicalRecord = () => {
    return <MedicalRecordForm />;
};

export default NewMedicalRecord;

