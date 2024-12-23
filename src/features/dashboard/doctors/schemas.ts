import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const DoctorSchema = z.object({
  name: requiredString.min(3, { message: "minimum 3 characters" }),
  title: requiredString,
  email: z.string().email({ message: "invalid email" }),
  password: z.string().min(6, { message: "minimum 6 characters" }),
  phone: z.string().length(11, { message: "minimum 11 characters" }),
  address: z.string().min(3, { message: "minimum 3 characters" }),
  imageUrl: z.string().optional(),
});

export type DoctorSchemaType = z.infer<typeof DoctorSchema>;
