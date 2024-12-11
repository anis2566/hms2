import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const TreatmentSchema = z.object({
  name: requiredString,
  description: requiredString,
});

export type TreatmentSchemaType = z.infer<typeof TreatmentSchema>;
