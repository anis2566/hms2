import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { DoctorSchema } from "../schemas";
import { sessionMiddleware, isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { ROLE } from "@/constant";
import { deleteFile } from "@/features/uploader/action";

const app = new Hono()
  .post(
    "/",
    zValidator("json", DoctorSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("json");

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
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", DoctorSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

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
  )
  .get(
    "/patients/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
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
      const id = await c.req.param("id");
      const { query, page, limit, sort } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [patients, totalCount] = await Promise.all([
        db.patient.findMany({
          where: {
            appointments: {
              some: {
                doctorId: id,
              },
            },
            ...(query && {
              name: {
                contains: query,
                mode: "insensitive",
              },
            }),
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.patient.count({
          where: {
            appointments: {
              some: {
                doctorId: id,
              },
            },
            ...(query && {
              name: {
                contains: query,
                mode: "insensitive",
              },
            }),
          },
        }),
      ]);

      return c.json({ patients, totalCount });
    }
  ).get(
    "/appointments/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
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
      const id = await c.req.param("id");
      const { query, page, limit, sort } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [appointments, totalCount] = await Promise.all([
        db.appointment.findMany({
          where: {
            doctorId: id,
            ...(query && {
              patient: {
                name: {
                  contains: query,
                  mode: "insensitive"
                }
              }
            }),
          },
          include: {
            patient: true
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.appointment.count({
          where: {
            doctorId: id,
            ...(query && {
              patient: {
                name: {
                  contains: query,
                  mode: "insensitive"
                }
              }
            }),
          },
        }),
      ]);

      return c.json({ appointments, totalCount });
    }
  )
  .put(
    "/changePassword/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", z.object({
      oldPassword: z.string(),
      newPassword: z.string(),
    })),
    async (c) => {
      try {
        const id = await c.req.param("id");
        const { oldPassword, newPassword } = await c.req.valid("json");

        const doctor = await db.doctor.findUnique({ where: { id } });

        if (!doctor) {
          return c.json({ error: "Doctor not found" }, 404);
        }

        const user = await db.user.findUnique({ where: { id: doctor.userId } });

        if (!user) {
          return c.json({ error: "User not found" }, 404);
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password!);

        if (!isMatch) {
          return c.json({ error: "Old password is incorrect" }, 400);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.doctor.update({ where: { id }, data: { password: hashedPassword } });

        return c.json({ success: "Password changed" }, 200);
      } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )

export default app;
