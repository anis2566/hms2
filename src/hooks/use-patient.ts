import { create } from "zustand";

interface DeletePatientState {
  isOpen: boolean;
  patientId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeletePatient = create<DeletePatientState>((set) => ({
  isOpen: false,
  patientId: "",
  onOpen: (id: string) => set({ isOpen: true, patientId: id }),
  onClose: () => set({ isOpen: false, patientId: "" }),
}));
