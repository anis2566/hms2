import { create } from "zustand";

interface DeleteServiceState {
  isOpen: boolean;
  serviceId: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteService = create<DeleteServiceState>((set) => ({
  isOpen: false,
  serviceId: "",
  onOpen: (id: string) => set({ isOpen: true, serviceId: id }),
  onClose: () => set({ isOpen: false, serviceId: "" }),
}));
