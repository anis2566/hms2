import { z } from "zod";

import { CATEGORY_STATUS } from "@/constant";

const requiredString = z.string().min(1, { message: "required" });

export const CategorySchema = z.object({
  name: requiredString,
  imageUrl: requiredString,
  description: z.string().optional(),
  status: z
    .nativeEnum(CATEGORY_STATUS)
    .refine((data) => Object.values(CATEGORY_STATUS).includes(data), {
      message: "required",
    }),
  tags: z.array(z.string()).optional(),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
