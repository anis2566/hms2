import { create } from "zustand";

interface DeleteDoctorState {
  isOpen: boolean;
  doctorId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteDoctor = create<DeleteDoctorState>((set) => ({
  isOpen: false,
  doctorId: "",
  onOpen: (id: string) => set({ isOpen: true, doctorId: id }),
  onClose: () => set({ isOpen: false, doctorId: "" }),
}));
