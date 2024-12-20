import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { DoctorSchema, DoctorSchemaWithoutImage } from "../schemas";
import { sessionMiddleware, isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { ROLE } from "@/constant";
import { deleteFile, uploadFile } from "@/features/uploader/action";

const app = new Hono()
  .post(
    "/",
    zValidator("form", DoctorSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("form");

      try {
        const existingUser = await db.user.findUnique({
          where: { email: data.email },
        });

        if (existingUser) {
          return c.json({ error: "User already exists" }, 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await db.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: data.email,
              password: hashedPassword,
              role: ROLE.DOCTOR,
            },
          });

          await tx.doctor.create({
            data: {
              ...data,
              userId: user.id,
            },
          });
        });

        return c.json({ success: "Doctor created." });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .post(
    "/withImage",
    zValidator("form", DoctorSchemaWithoutImage),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("form");

      try {
        const existingUser = await db.user.findUnique({
          where: { email: data.email },
        });

        if (existingUser) {
          return c.json({ error: "User already exists" }, 400);
        }

        let imageUrl = null;
        if (data.imageUrl) {
          imageUrl = await uploadFile({
            file: data.imageUrl,
            path: "doctors",
            name: data.name,
            extension: "png",
          });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        await db.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: data.email,
              password: hashedPassword,
              role: ROLE.DOCTOR,
            },
          });

          await tx.doctor.create({
            data: {
              ...data,
              imageUrl,
              userId: user.id,
            },
          });
        });

        return c.json({ success: "Doctor created." });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("form", DoctorSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("form");

      try {
        const doctor = await db.doctor.findUnique({
          where: { id },
        });

        if (!doctor) {
          return c.json({ error: "Doctor not found" }, 404);
        }

        await db.doctor.update({
          where: { id },
          data: {
            ...data,
          },
        });

        return c.json({ success: "Doctor edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit doctor" }, 500);
      }
    }
  )
  .put(
    "/edit/withImage/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("form", DoctorSchemaWithoutImage),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("form");

      try {
        const doctor = await db.doctor.findUnique({
          where: { id },
        });

        if (!doctor) {
          return c.json({ error: "Doctor not found" }, 404);
        }

        let imageUrl = null;
        if (data.imageUrl) {
          imageUrl = await uploadFile({
            file: data.imageUrl,
            path: "doctors",
            name: data.name,
            extension: "png",
          });
        }

        await db.doctor.update({
          where: { id },
          data: {
            ...data,
            imageUrl: imageUrl || doctor.imageUrl,
          },
        });

        return c.json({ success: "Doctor edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit doctor" }, 500);
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
        const doctor = await db.doctor.findUnique({ where: { id } });

        if (!doctor) {
          return c.json({ error: "Doctor not found" }, 404);
        }

        if (doctor.imageUrl) {
          await deleteFile({ fileName: doctor.imageUrl });
        }

        await db.doctor.delete({ where: { id } });

        return c.json({ success: "Doctor deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete doctor" }, 500);
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
        title: z.string().optional(),
      })
    ),
    async (c) => {
      const { query, page, limit, sort, title } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [doctors, totalCount] = await Promise.all([
        db.doctor.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(title && { title: { equals: title } }),
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.doctor.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(title && { title: { equals: title } }),
          },
        }),
      ]);

      return c.json({ doctors, totalCount });
    }
  );

export default app;
