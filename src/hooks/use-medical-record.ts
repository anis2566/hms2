import { create } from "zustand";

interface DeleteMedicalRecordState {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteMedicalRecord = create<DeleteMedicalRecordState>(
  (set) => ({
    isOpen: false,
    id: "",
    onOpen: (id: string) => set({ isOpen: true, id: id }),
    onClose: () => set({ isOpen: false, id: "" }),
  })
);
