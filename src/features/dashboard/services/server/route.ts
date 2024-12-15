import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { ServiceSchema } from "../schemas";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const app = new Hono()
  .post(
    "/",
    zValidator("json", ServiceSchema),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const body = await c.req.valid("json");

      try {
        const service = await db.service.findFirst({
          where: {
            name: body.name,
          },
        });

        if (service) {
          return c.json({ error: "Service already exists" }, 400);
        }

        await db.service.create({
          data: {
            name: body.name,
            price: body.price,
            description: body.description,
            status: body.status,
          },
        });

        return c.json({ success: "Service created." }, 201);
      } catch (error) {
        return c.json({ error: "Internal server error" }, 500);
      }
    }
  )
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", ServiceSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const service = await db.service.findUnique({
          where: { id },
        });

        if (!service) {
          return c.json({ error: "Service not found" }, 404);
        }

        await db.service.update({
          where: { id },
          data: { ...data },
        });

        return c.json({ success: "Service edited" }, 200);
      } catch {
        return c.json({ error: "Failed to edit service" }, 500);
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
        const service = await db.service.findUnique({ where: { id } });

        if (!service) {
          return c.json({ error: "Service not found" }, 404);
        }

        await db.service.delete({ where: { id } });

        return c.json({ success: "Service deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete service" }, 500);
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
        status: z.string().optional(),
      })
    ),
    async (c) => {
      const { query, page, limit, sort, status } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [services, totalCount] = await Promise.all([
        db.service.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(status && { status: status }),
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.service.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
            ...(status && { status: status }),
          },
        }),
      ]);

      return c.json({ services, totalCount });
    }
  );

export default app;
