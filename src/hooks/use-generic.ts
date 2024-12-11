import { create } from "zustand";

import { GenericSchemaType } from "@/features/dashboard/medicines/schemas";

interface CreateGenericState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreateGeneric = create<CreateGenericState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface UpdateGenericState {
  isOpen: boolean;
  id: string;
  generic: GenericSchemaType | null;
  onOpen: (id: string, generic: GenericSchemaType) => void;
  onClose: () => void;
}

export const useUpdateGeneric = create<UpdateGenericState>((set) => ({
  isOpen: false,
  id: "",
  generic: null,
  onOpen: (id: string, generic: GenericSchemaType) =>
    set({ isOpen: true, id, generic }),
  onClose: () => set({ isOpen: false, id: "", generic: null }),
}));

interface DeleteGenericState {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useDeleteGeneric = create<DeleteGenericState>((set) => ({
  isOpen: false,
  id: "",
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: "" }),
}));
