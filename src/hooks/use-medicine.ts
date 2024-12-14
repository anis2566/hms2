import { MedicalRecordSchemaType } from "@/features/dashboard/patients/schemas";
import { UseFormReturn } from "react-hook-form";
import { create } from "zustand";

interface DeleteMedicineState {
  isOpen: boolean;
  medicineId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteMedicine = create<DeleteMedicineState>((set) => ({
  isOpen: false,
  medicineId: "",
  onOpen: (id: string) => set({ isOpen: true, medicineId: id }),
  onClose: () => set({ isOpen: false, medicineId: "" }),
}));

interface AddMedicineState {
  isOpen: boolean;
  form: UseFormReturn<MedicalRecordSchemaType> | null;
  onOpen: (form: UseFormReturn<MedicalRecordSchemaType>) => void;
  onClose: () => void;
}

export const useAddMedicine = create<AddMedicineState>((set) => ({
  isOpen: false,
  form: null,
  onOpen: (form: UseFormReturn<MedicalRecordSchemaType>) =>
    set({ isOpen: true, form }),
  onClose: () => set({ isOpen: false, form: null }),
}));
