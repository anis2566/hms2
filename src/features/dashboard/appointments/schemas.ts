import { z } from "zod";

import { APPOINTMENT_STATUS } from "@/constant";

const requiredString = z.string().min(1, { message: "required" });

export const AppointmentSchema = z.object({
  purpose: requiredString,
  description: z.string().optional(),
  patientId: requiredString,
  doctorId: requiredString,
  date: z.date({ required_error: "required" }),
  startTime: z.date({ required_error: "required" }),
  endTime: z.date({ required_error: "required" }),
  status: z
    .nativeEnum(APPOINTMENT_STATUS)
    .refine((value) => Object.values(APPOINTMENT_STATUS).includes(value), {
      message: "required",
    }),
});

export type AppointmentSchemaType = z.infer<typeof AppointmentSchema>;
