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
