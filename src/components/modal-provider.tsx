"use client"

import { DeletePatientModal } from "@/features/dashboard/patients/components/delete-modal"
import { DeleteTreatmentModal } from "@/features/dashboard/treatments/components/delete-modal"
import { NewGenericModal } from "@/features/dashboard/medicines/components/new-generic-modal"
import { EditGenericModal } from "@/features/dashboard/medicines/components/edit-generic-modal"
import { DeleteGenericModal } from "@/features/dashboard/medicines/components/delete-generic-modal"
import { NewManufacturerModal } from "@/features/dashboard/medicines/components/new-manufacturer-modal"
import { EditManufacturerModal } from "@/features/dashboard/medicines/components/edit-manufacturer-modal"
import { DeleteManufacturerModal } from "@/features/dashboard/medicines/components/delete-manufacturer-modal"
import { DeleteMedicineModal } from "@/features/dashboard/medicines/components/delete-modal"
import { DeleteDoctorModal } from "@/features/dashboard/doctors/components/delete-modal"
import { AddMedicineModal } from "@/features/dashboard/patients/components/add-medicine-modal"
import { DeleteServiceModal } from "@/features/dashboard/services/components/delete-modal"
import { AppointmentViewModal } from "@/features/dashboard/appointments/components/view-modal"
import { AppointmentStatusModal } from "@/features/dashboard/appointments/components/status-modal"
import { DeleteAppointmentModal } from "@/features/dashboard/appointments/components/delete-modal"
import { DeleteMedicalRecordModla } from "@/features/dashboard/patients/components/delete-medical-record-modal"

export const ModalProvider = () => {
    return (
        <>
            <DeletePatientModal />
            <DeleteTreatmentModal />
            <NewGenericModal />
            <EditGenericModal />
            <DeleteGenericModal />
            <NewManufacturerModal />
            <EditManufacturerModal />
            <DeleteManufacturerModal />
            <DeleteMedicineModal />
            <DeleteDoctorModal />
            <AddMedicineModal />
            <DeleteServiceModal />
            <AppointmentViewModal />
            <AppointmentStatusModal />
            <DeleteAppointmentModal />
            <DeleteMedicalRecordModla />
        </>
    )
}
