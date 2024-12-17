import { Appointment, Doctor, Patient, Service } from "@prisma/client";
import { create } from "zustand";

import { APPOINTMENT_STATUS } from "@/constant";

interface AppointmentWithRelation extends Appointment {
  patient: Patient;
  service: Service;
}

interface AppointmentViewState {
  isOpen: boolean;
  appointments: AppointmentWithRelation[] | [];
  onOpen: (appointments: AppointmentWithRelation[]) => void;
  onClose: () => void;
}

export const useAppointmentView = create<AppointmentViewState>((set) => ({
  isOpen: false,
  appointments: [],
  onOpen: (appointments: AppointmentWithRelation[]) =>
    set({ isOpen: true, appointments }),
  onClose: () => set({ isOpen: false, appointments: [] }),
}));

interface AppointmentStatusState {
  isOpen: boolean;
  id: string;
  status: APPOINTMENT_STATUS;
  onOpen: (id: string, status: APPOINTMENT_STATUS) => void;
  onClose: () => void;
}

export const useAppointmentStatus = create<AppointmentStatusState>((set) => ({
  isOpen: false,
  id: "",
  status: APPOINTMENT_STATUS.PENDING,
  onOpen: (id: string, status: APPOINTMENT_STATUS) =>
    set({ isOpen: true, id, status }),
  onClose: () =>
    set({ isOpen: false, id: "", status: APPOINTMENT_STATUS.PENDING }),
}));

interface AppointmentDeleteState {
  isOpen: boolean;
  id: string;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useAppointmentDelete = create<AppointmentDeleteState>((set) => ({
  isOpen: false,
  id: "",
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: "" }),
}));
