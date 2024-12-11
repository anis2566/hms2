import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { PatientSchema } from "../schemas";
import { sessionMiddleware, isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";

const app = new Hono().post(
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
          dob: new Date(data.dob),
        },
      });
      return c.json({ success: "Patient created." });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  }
);

export default app;
