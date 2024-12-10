import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const BrandSchema = z.object({
  name: requiredString.min(3, { message: "minimum 3 characters" }),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
});

export type BrandSchemaType = z.infer<typeof BrandSchema>;
