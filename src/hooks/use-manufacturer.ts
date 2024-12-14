import { create } from "zustand";

interface CreateManufacturerState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateManufacturer = create<CreateManufacturerState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

type Manufacturer = {
  name: string;
  description: string;
  imageUrl: string | null;
};

interface UpdateManufacturerState {
  isOpen: boolean;
  id: string;
  manufacturer: Manufacturer | null;
  onOpen: (id: string, manufacturer: Manufacturer) => void;
  onClose: () => void;
}

export const useUpdateManufacturer = create<UpdateManufacturerState>((set) => ({
  isOpen: false,
  id: "",
  manufacturer: null,
  onOpen: (id: string, manufacturer: Manufacturer) =>
    set({ isOpen: true, id, manufacturer }),
  onClose: () => set({ isOpen: false, id: "", manufacturer: null }),
}));

interface DeleteManufacturerState {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteManufacturer = create<DeleteManufacturerState>((set) => ({
  isOpen: false,
  id: "",
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: "" }),
}));
