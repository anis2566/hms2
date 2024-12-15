import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { APPOINTMENT_STATUS } from "@/constant";

const app = new Hono()
  .get("/getServicesForSelect", async (c) => {
    const services = await db.service.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({ services });
  })
  .get("/getPatientsForSelect", async (c) => {
    const patients = await db.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({ patients });
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        purpose: z.string(),
        description: z.string().optional(),
        patientId: z.string(),
        doctorId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        status: z.nativeEnum(APPOINTMENT_STATUS),
      })
    ),
    sessionMiddleware,
    isAdmin,
    async (c) => {
      const body = c.req.valid("json");

      try {
        const isBooked = await db.appointment.findFirst({
          where: {
            OR: [
              {
                patientId: body.patientId,
                doctorId: body.doctorId,
                date: new Date(body.date),
                startTime: new Date(body.startTime),
                endTime: new Date(body.endTime),
              },
              {
                doctorId: body.doctorId,
                date: new Date(body.date),
                startTime: new Date(body.startTime),
                endTime: new Date(body.endTime),
              },
            ],
          },
        });

        if (isBooked) {
          return c.json({ error: "Doctor or Patient already booked" });
        }

        await db.appointment.create({
          data: {
            ...body,
            date: new Date(body.date),
            startTime: new Date(body.startTime),
            endTime: new Date(body.endTime),
          },
        });
        return c.json({ success: "Appointment created." });
      } catch {
        return c.json({ error: "Failed to create appointment." }, 500);
      }
    }
  );
export default app;
