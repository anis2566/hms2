import { z } from "zod";

import { GENDER, BLOOD_GROUP } from "@/constant";

const requiredString = z.string().min(1, { message: "required" });

export const PatientSchema = z.object({
  name: requiredString.min(3, { message: "invalid name" }),
  email: requiredString.email({ message: "invalid email" }).optional(),
  gender: z
    .nativeEnum(GENDER)
    .refine((value) => Object.values(GENDER).includes(value), {
      message: "required",
    }),
  phone: requiredString.min(11, { message: "invalid phone number" }),
  address: requiredString.min(6, { message: "invalid address" }),
  dob: z.date(),
  emergencyContact: requiredString.min(11, { message: "invalid phone number" }),
  imageUrl: z.string().optional(),
  bloodGroup: z.nativeEnum(BLOOD_GROUP).optional(),
});

export type PatientSchemaType = z.infer<typeof PatientSchema>;
