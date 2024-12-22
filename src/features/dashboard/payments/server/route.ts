import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { PAYMENT_STATUS } from "@/constant";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    isAdmin,
    zValidator(
      "query",
      z.object({
        status: z.string().optional(),
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.string().optional(),
        query: z.string().optional(),
      })
    ),
    async (c) => {
      const { status, page, limit, sort, query } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [payments, totalCount] = await Promise.all([
        db.payment.findMany({
          where: {
            ...(query && {
              patient: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            }),
            ...(status && { status }),
          },
          include: {
            patient: true,
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.payment.count({
          where: {
            ...(query && {
              patient: {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            }),
            ...(status && { status }),
          },
        }),
      ]);

      return c.json({ payments, totalCount });
    }
  )
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator(
      "json",
      z.object({
        patientId: z.string(),
        method: z.string(),
        amount: z.number(),
        status: z
          .nativeEnum(PAYMENT_STATUS)
          .refine((value) => Object.values(PAYMENT_STATUS).includes(value), {
            message: "required",
          }),
      })
    ),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        await db.payment.update({
          where: { id },
          data: {
            ...data,
          },
        });

        return c.json({ success: "Payment updated" }, 200);
      } catch {
        return c.json({ error: "Failed to update payment" }, 500);
      }
    }
  )
  .put(
    "/status/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator(
      "json",
      z.object({
        status: z
          .nativeEnum(PAYMENT_STATUS)
          .refine((value) => Object.values(PAYMENT_STATUS).includes(value), {
            message: "required",
          }),
      })
    ),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        await db.payment.update({
          where: { id },
          data: {
            ...data,
          },
        });

        return c.json({ success: "Payment status updated" }, 200);
      } catch {
        return c.json({ error: "Failed to update payment status" }, 500);
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
        const payment = await db.payment.findUnique({ where: { id } });

        if (!payment) {
          return c.json({ error: "Payment not found" }, 404);
        }

        await db.payment.delete({ where: { id } });

        return c.json({ success: "Payment deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete payment" }, 500);
      }
    }
  );

export default app;
