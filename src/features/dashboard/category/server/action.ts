"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { CategorySchema, CategorySchemaType } from "../schemas";

export const CREATE_CATEGORY_ACTION = async (values: CategorySchemaType) => {
  const { data, success } = CategorySchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    const category = await db.category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (category) {
      return {
        error: "Category already exists",
      };
    }

    await db.category.create({
      data: {
        ...data,
      },
    });

    revalidatePath("/dashboard/categories");

    return {
      success: "Category created",
    };
  } catch {
    throw new Error("Failed to create category");
  }
};

interface EditCategory {
  id: string;
  values: CategorySchemaType;
}

export const EDIT_CATEGORY_ACTION = async ({ id, values }: EditCategory) => {
  const { data, success } = CategorySchema.safeParse(values);

  if (!success) {
    return {
      error: "Invalid input values",
    };
  }

  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return {
        error: "Category not found",
      };
    }

    await db.category.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });

    revalidatePath("/dashboard/category");

    return {
      success: "Category updated",
    };
  } catch {
    throw new Error("Failed to update category");
  }
};

export const DELETE_CATEGORY_ACTION = async (id: string) => {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      return {
        error: "Category not found",
      };
    }

    await db.category.delete({
      where: {
        id,
      },
    });

    revalidatePath("/dashboard/category");

    return {
      success: "Category deleted",
    };
  } catch {
    throw new Error("Failed to delete category");
  }
};
