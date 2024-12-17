import { Appointment, Patient, Service } from "@prisma/client";
import { create } from "zustand";

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
