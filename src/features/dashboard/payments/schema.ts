import { z } from "zod";

import { PAYMENT_STATUS } from "@/constant";

export const PaymentSchema = z.object({
  patientId: z.string(),
  method: z.string(),
  amount: z.number(),
  status: z
    .nativeEnum(PAYMENT_STATUS)
    .refine((value) => Object.values(PAYMENT_STATUS).includes(value), {
      message: "required",
    }),
});

export type PaymentSchemaType = z.infer<typeof PaymentSchema>;
