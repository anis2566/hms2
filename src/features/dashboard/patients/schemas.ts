import { z } from "zod";

import {
  GENDER,
  BLOOD_GROUP,
  MEDICINE_INSTRUCTION,
  MEDICINE_FREQUENCY,
} from "@/constant";

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
  dob: requiredString,
  emergencyContact: requiredString.min(11, { message: "invalid phone number" }),
  imageUrl: z.string().optional(),
  bloodGroup: z.nativeEnum(BLOOD_GROUP).optional(),
});

export type PatientSchemaType = z.infer<typeof PatientSchema>;

export const MedicalRecordMedicineSchema = z.object({
  instruction: z
    .nativeEnum(MEDICINE_INSTRUCTION)
    .refine((value) => Object.values(MEDICINE_INSTRUCTION).includes(value), {
      message: "required",
    }),
  frequency: z
    .nativeEnum(MEDICINE_FREQUENCY)
    .refine((value) => Object.values(MEDICINE_FREQUENCY).includes(value), {
      message: "required",
    }),
  quantity: z.number({ required_error: "required" }),
  dosageQuantity: z.number({ required_error: "required" }),
  dosage: z.array(z.string()),
  medicineId: requiredString,
  medicinePrice: z.number({ required_error: "required" }),
  medicineName: z.string({ required_error: "required" }),
});

export type MedicalRecordMedicineSchemaType = z.infer<
  typeof MedicalRecordMedicineSchema
>;

export const MedicalRecordSchema = z.object({
  patientId: requiredString,
  complains: requiredString,
  diagnosis: z.string().optional(),
  vitalSigns: z.string().optional(),
  doctorId: requiredString,
  treatments: z.array(z.string()).optional(),
  medicines: z.array(MedicalRecordMedicineSchema).optional(),
  attachments: z.array(z.string()).optional(),
});

export type MedicalRecordSchemaType = z.infer<typeof MedicalRecordSchema>;

export const PatientHealthSchema = z.object({
  bloodGroup: z
    .nativeEnum(BLOOD_GROUP)
    .refine((value) => Object.values(BLOOD_GROUP).includes(value), {
      message: "required",
    }),
  height: z.number(),
  weight: z.number(),
  allergies: z.string().optional(),
  habits: z.string().optional(),
  medicalHistory: z.string().optional(),
  patientId: requiredString,
});

export type PatientHealthSchemaType = z.infer<typeof PatientHealthSchema>;
