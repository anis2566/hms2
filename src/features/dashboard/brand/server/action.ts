"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { BrandSchema, BrandSchemaType } from "../schemas";

export const CREATE_BRAND_ACTION = async (values: BrandSchemaType) => {
  const { data, success } = BrandSchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    const brand = await db.brand.findFirst({
      where: {
        name: data.name,
      },
    });

    if (brand) {
      return {
        error: "Brand already exists",
      };
    }

    await db.brand.create({
      data: {
        ...data,
      },
    });

    revalidatePath("/dashboard/brand");

    return {
      success: "Brand created",
    };
  } catch {
    throw new Error("Failed to create brand");
  }
};

interface EditBrand {
  id: string;
  values: BrandSchemaType;
}

export const EDIT_BRAND_ACTION = async ({ id, values }: EditBrand) => {
  const { data, success } = BrandSchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });

    if (!brand) {
      return {
        error: "Brand not found",
      };
    }

    await db.brand.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/dashboard/brand");

    return {
      success: "Brand updated",
    };
  } catch {
    throw new Error("Failed to update brand");
  }
};

export const DELETE_BRAND_ACTION = async (id: string) => {
  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });

    if (!brand) {
      return {
        error: "Brand not found",
      };
    }

    await db.brand.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/brand");

    return {
      success: "Brand deleted",
    };
  } catch {
    throw new Error("Failed to delete brand");
  }
};
