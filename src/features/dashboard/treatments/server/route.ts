import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { TreatmentSchema } from "../schemas";
import { sessionMiddleware, isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const app = new Hono()
  .post(
    "/",
    zValidator("json", TreatmentSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const data = await c.req.valid("json");

      try {
        const treatment = await db.treatment.findFirst({
          where: {
            name: data.name,
          },
        });

        if (treatment) {
          return c.json({ error: "Treatment already exists" }, 400);
        }

        await db.treatment.create({
          data: {
            ...data,
          },
        });
        return c.json({ success: "Treatment created." });
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
    zValidator("json", TreatmentSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const treatment = await db.treatment.findUnique({
          where: { id },
        });

        if (!treatment) {
          return c.json({ error: "Treatment not found" }, 404);
        }

        await db.treatment.update({
          where: { id },
          data: { ...data },
        });

        return c.json({ success: "Treatment edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit treatment" }, 500);
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
        const treatment = await db.treatment.findUnique({ where: { id } });

        if (!treatment) {
          return c.json({ error: "Treatment not found" }, 404);
        }

        await db.treatment.delete({ where: { id } });

        return c.json({ success: "Treatment deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete treatment" }, 500);
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

      const [treatments, totalCount] = await Promise.all([
        db.treatment.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
          orderBy: {
            ...(sort === "desc" ? { createdAt: "desc" } : { createdAt: "asc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.treatment.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
        }),
      ]);

      return c.json({ treatments, totalCount });
    }
  );

export default app;
