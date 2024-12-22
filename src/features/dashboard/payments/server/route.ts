import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const app = new Hono().get(
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
    })
  ),
  async (c) => {
    const { status, page, limit, sort } = await c.req.valid("query");

    const pageNumber = parseInt(page || "1");
    const limitNumber = parseInt(limit || "5");

    const [payments, totalCount] = await Promise.all([
      db.payment.findMany({
        where: {
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
          ...(status && { status }),
        },
      }),
    ]);

    return c.json({ payments, totalCount });
  }
);

export default app;
