import { create } from "zustand";

interface DeleteTreatmentState {
  isOpen: boolean;
  treatmentId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteTreatment = create<DeleteTreatmentState>((set) => ({
  isOpen: false,
  treatmentId: "",
  onOpen: (id: string) => set({ isOpen: true, treatmentId: id }),
  onClose: () => set({ isOpen: false, treatmentId: "" }),
}));
