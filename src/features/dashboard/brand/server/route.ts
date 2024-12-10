import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import { BrandSchema } from "../schemas";
import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
  .post(
    "/create",
    sessionMiddleware,
    isAdmin,
    zValidator("json", BrandSchema),
    async (c) => {
      const { name, description, imageUrl } = await c.req.valid("json");

      try {
        const brand = await db.brand.findFirst({
          where: {
            name: name,
          },
        });

        if (brand) {
          return c.json({ error: "Brand already exists" }, 400);
        }

        await db.brand.create({
          data: {
            name,
            description,
            imageUrl,
          },
        });

        return c.json({ success: "Brand created" }, 200);
      } catch (error) {
        return c.json({ error: "Failed to create brand" }, 500);
      }
    }
  )
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("json", BrandSchema),
    async (c) => {
      const id = await c.req.param("id");
      const { name, description, imageUrl } = await c.req.valid("json");

      try {
        const brand = await db.brand.findUnique({
          where: { id },
        });

        if (!brand) {
          return c.json({ error: "Brand not found" }, 404);
        }

        await db.brand.update({
          where: { id },
          data: { name, description, imageUrl },
        });

        return c.json({ success: "Brand edited" }, 200);
      } catch (error) {
        return c.json({ error: "Failed to edit brand" }, 500);
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
        const brand = await db.brand.findUnique({ where: { id } });

        if (!brand) {
          return c.json({ error: "Brand not found" }, 404);
        }

        await db.brand.delete({ where: { id } });

        return c.json({ success: "Brand deleted" }, 200);
      } catch (error) {
        return c.json({ error: "Failed to delete brand" }, 500);
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

      const [brands, totalCount] = await Promise.all([
        db.brand.findMany({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
          orderBy: {
            ...(sort === "desc" ? { createdAt: "desc" } : { createdAt: "asc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.brand.count({
          where: {
            ...(query && { name: { contains: query, mode: "insensitive" } }),
          },
        }),
      ]);

      console.log(brands, totalCount);

      return c.json({ brands, totalCount });
    }
  );

export default app;
