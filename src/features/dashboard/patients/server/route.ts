import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { PatientSchema } from "../schemas";
import { sessionMiddleware, isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const app = new Hono()
  .post(
    "/",
    zValidator("json", PatientSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("json");

      try {
        await db.patient.create({
          data: {
            ...data,
            dob: new Date(
              new Date(data.dob).setDate(new Date(data.dob).getDate() + 1)
            ),
          },
        });
        return c.json({ success: "Patient created." });
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
    zValidator("json", PatientSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const patient = await db.patient.findUnique({
          where: { id },
        });

        if (!patient) {
          return c.json({ error: "Patient not found" }, 404);
        }

        await db.patient.update({
          where: { id },
          data: { ...data },
        });

        return c.json({ success: "Patient edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit patient" }, 500);
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
        const patient = await db.patient.findUnique({ where: { id } });

        if (!patient) {
          return c.json({ error: "Patient not found" }, 404);
        }

        await db.patient.delete({ where: { id } });

        return c.json({ success: "Patient deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete patient" }, 500);
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
        gender: z.string().optional(),
        date: z.string().optional(),
      })
    ),
    async (c) => {
      const {
        query,
        page,
        limit,
        sort,
        gender,
        date: dateString,
      } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const date = dateString
        ? new Date(
            new Date(dateString).setDate(new Date(dateString).getDate() - 1)
          )
        : null;

      const [patients, totalCount] = await Promise.all([
        db.patient.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(gender && { gender: gender }),
            ...(date && {
              createdAt: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999)),
              },
            }),
          },
          orderBy: {
            ...(sort === "desc" ? { createdAt: "desc" } : { createdAt: "asc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.patient.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(gender && { gender: gender }),
            ...(date && {
              createdAt: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999)),
              },
            }),
          },
        }),
      ]);

      return c.json({ patients, totalCount });
    }
  );

export default app;
