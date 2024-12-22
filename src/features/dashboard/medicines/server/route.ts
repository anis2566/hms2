import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  GenericSchema,
  ManufacturerSchema,
  MedicineSchema,
} from "@/features/dashboard/medicines/schemas";
import { isAdmin } from "@/lib/session-middleware";
import { sessionMiddleware } from "@/lib/session-middleware";
import { deleteFile } from "@/features/uploader/action";

const app = new Hono()
  .post(
    "/generic/create",
    zValidator("json", GenericSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("json");

      try {
        const generic = await db.medicineGeneric.findFirst({
          where: {
            name: data.name,
          },
        });

        if (generic) {
          return c.json({ error: "Generic already exists" }, 400);
        }

        await db.medicineGeneric.create({
          data: {
            ...data,
          },
        });
        return c.json({ success: "Generic created." });
      } catch {
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .put(
    "/generics/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", GenericSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const generic = await db.medicineGeneric.findUnique({
          where: { id },
        });

        if (!generic) {
          return c.json({ error: "Generic not found" }, 404);
        }

        await db.medicineGeneric.update({
          where: { id },
          data: { ...data },
        });

        return c.json({ success: "Generic edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit generic" }, 500);
      }
    }
  )
  .delete(
    "/generics/delete/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = await c.req.param("id");

      try {
        const generic = await db.medicineGeneric.findUnique({ where: { id } });

        if (!generic) {
          return c.json({ error: "Generic not found" }, 404);
        }

        await db.medicineGeneric.delete({ where: { id } });

        return c.json({ success: "Generic deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete generic" }, 500);
      }
    }
  )
  .get(
    "/generics",
    zValidator(
      "query",
      z.object({
        query: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.string().optional(),
      })
    ),
    async (c) => {
      const { query, page, limit, sort } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [generics, totalCount] = await Promise.all([
        db.medicineGeneric.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
          include: {
            medicines: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.medicineGeneric.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
        }),
      ]);

      return c.json({ generics, totalCount });
    }
  )
  .get("/generics/forSelect", async (c) => {
    const generics = await db.medicineGeneric.findMany();
    return c.json({ generics });
  })
  .post(
    "/manufacturers/create",
    zValidator("json", ManufacturerSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("json");

      try {
        const manufacturer = await db.medicineManufacturer.findFirst({
          where: {
            name: data.name,
          },
        });

        if (manufacturer) {
          return c.json({ error: "Manufacturer already exists" }, 400);
        }

        await db.medicineManufacturer.create({
          data: {
            ...data,
          },
        });
        return c.json({ success: "Manufacturer created." });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .put(
    "/manufacturers/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", ManufacturerSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const manufacturer = await db.medicineManufacturer.findUnique({
          where: { id },
        });

        if (!manufacturer) {
          return c.json({ error: "Manufacturer not found" }, 404);
        }

        await db.medicineManufacturer.update({
          where: { id },
          data: {
            ...data,
          },
        });

        return c.json({ success: "Manufacturer edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit manufacturer" }, 500);
      }
    }
  )
  .delete(
    "/manufacturers/delete/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = await c.req.param("id");

      try {
        const manufacturer = await db.medicineManufacturer.findUnique({
          where: { id },
        });

        if (!manufacturer) {
          return c.json({ error: "Manufacturer not found" }, 404);
        }

        if (manufacturer.imageUrl) {
          await deleteFile({
            fileName: manufacturer.imageUrl,
          });
        }

        await db.medicineManufacturer.delete({ where: { id } });

        return c.json({ success: "Manufacturer deleted" }, 200);
      } catch (error) {
        console.log(error);
        return c.json({ error: "Failed to delete manufacturer" }, 500);
      }
    }
  )
  .get(
    "/manufacturers",
    zValidator(
      "query",
      z.object({
        query: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.string().optional(),
      })
    ),
    async (c) => {
      const { query, page, limit, sort } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [manufacturers, totalCount] = await Promise.all([
        db.medicineManufacturer.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
          include: {
            medicines: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.medicineManufacturer.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
        }),
      ]);

      return c.json({ manufacturers, totalCount });
    }
  )
  .get("/manufacturers/forSelect", async (c) => {
    const manufacturers = await db.medicineManufacturer.findMany();
    return c.json({ manufacturers });
  })
  .post(
    "/",
    zValidator("json", MedicineSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("json");

      try {
        const medicine = await db.medicine.findFirst({
          where: {
            name: data.name,
            genericId: data.genericId,
          },
        });

        if (medicine) {
          return c.json({ error: "Medicine already exists" }, 400);
        }

        await db.medicine.create({
          data: {
            ...data,
          },
        });
        return c.json({ success: "Medicine created." });
      } catch {
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", MedicineSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const medicine = await db.medicine.findUnique({
          where: { id },
        });

        if (!medicine) {
          return c.json({ error: "Medicine not found" }, 404);
        }

        await db.medicine.update({
          where: { id },
          data: { ...data },
        });

        return c.json({ success: "Medicine edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit medicine" }, 500);
      }
    }
  )
  .delete(
    "/delete/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const id = await c.req.param("id");

      try {
        const medicine = await db.medicine.findUnique({
          where: { id },
        });

        if (!medicine) {
          return c.json({ error: "Medicine not found" }, 404);
        }

        await db.medicine.delete({ where: { id } });

        return c.json({ success: "Medicine deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete medicine" }, 500);
      }
    }
  )
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        query: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.string().optional(),
      })
    ),
    async (c) => {
      const { query, page, limit, sort } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [medicines, totalCount] = await Promise.all([
        db.medicine.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
          include: {
            generic: true,
            manufacturer: true,
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.medicine.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
        }),
      ]);

      return c.json({ medicines, totalCount });
    }
  );

export default app;
