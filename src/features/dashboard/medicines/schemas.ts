import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const GenericSchema = z.object({
  name: requiredString,
  description: z.string().optional(),
});

export type GenericSchemaType = z.infer<typeof GenericSchema>;

export const ManufacturerSchema = z.object({
  name: requiredString,
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type ManufacturerSchemaType = z.infer<typeof ManufacturerSchema>;

export const MedicineSchema = z.object({
  name: requiredString,
  description: z.string().optional(),
  sideEffects: z.string().optional(),
  price: z.number({ required_error: "required" }),
  genericId: requiredString,
  manufacturerId: requiredString,
});

export type MedicineSchemaType = z.infer<typeof MedicineSchema>;
