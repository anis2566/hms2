import { PAYMENT_STATUS } from "@/constant";
import { create } from "zustand";

interface PaymentStatusState {
  isOpen: boolean;
  id: string;
  status: PAYMENT_STATUS;
  onOpen: (id: string, status: PAYMENT_STATUS) => void;
  onClose: () => void;
}

export const usePaymentStatus = create<PaymentStatusState>((set) => ({
  isOpen: false,
  id: "",
  status: PAYMENT_STATUS.PENDING,
  onOpen: (id: string, status: PAYMENT_STATUS) =>
    set({ isOpen: true, id, status }),
  onClose: () => set({ isOpen: false, id: "", status: PAYMENT_STATUS.PENDING }),
}));

interface PaymentDeleteState {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const usePaymentDelete = create<PaymentDeleteState>((set) => ({
  isOpen: false,
  id: "",
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: "" }),
}));
