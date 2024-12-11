import { create } from "zustand";

import { ManufacturerSchemaType } from "@/features/dashboard/medicines/schemas";

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

interface UpdateManufacturerState {
  isOpen: boolean;
  id: string;
  manufacturer: ManufacturerSchemaType | null;
  onOpen: (id: string, manufacturer: ManufacturerSchemaType) => void;
  onClose: () => void;
}

export const useUpdateManufacturer = create<UpdateManufacturerState>((set) => ({
  isOpen: false,
  id: "",
  manufacturer: null,
  onOpen: (id: string, manufacturer: ManufacturerSchemaType) =>
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
