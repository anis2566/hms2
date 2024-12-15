import { SERVICE_STATUS } from "@/constant";
import { z } from "zod";

const requiredString = z.string().min(1, { message: "required" });

export const ServiceSchema = z.object({
  name: requiredString,
  price: z.number().min(1, { message: "required" }),
  description: z.string().optional(),
  status: z
    .nativeEnum(SERVICE_STATUS)
    .refine((value) => Object.values(SERVICE_STATUS).includes(value), {
      message: "required",
    }),
});

export type ServiceSchemaType = z.infer<typeof ServiceSchema>;
