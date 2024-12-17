import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { APPOINTMENT_STATUS } from "@/constant";
import { endOfMonth, getDaysInMonth, startOfMonth } from "date-fns";
import { Appointment, Patient, Service } from "@prisma/client";
import { AppointmentSchema } from "../schemas";

interface AppointmentWithRelation extends Appointment {
  patient: Patient;
  service: Service;
}

type AppointmentData = {
  name: string;
  count: number;
  appointments: AppointmentWithRelation[];
};

type AppointmentsByDate = {
  date: string;
  count: number;
  appointments: AppointmentData[];
}[];

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
        serviceId: z.string(),
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
            doctorId: body.doctorId,
            date: new Date(body.date),
            OR: [
              {
                AND: [
                  { startTime: { lte: new Date(body.startTime) } },
                  { endTime: { gt: new Date(body.startTime) } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: new Date(body.endTime) } },
                  { endTime: { gte: new Date(body.endTime) } },
                ],
              },
              {
                AND: [
                  { startTime: { lte: new Date(body.startTime) } },
                  { endTime: { gte: new Date(body.endTime) } },
                ],
              },
              {
                AND: [
                  { startTime: { gte: new Date(body.startTime) } },
                  { endTime: { lte: new Date(body.endTime) } },
                ],
              },
            ],
          },
        });

        if (isBooked) {
          return c.json({ error: "Doctor already booked" });
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
  )
  .put(
    "/edit/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator(
      "json",
      z.object({
        serviceId: z.string(),
        description: z.string().optional(),
        patientId: z.string(),
        doctorId: z.string(),
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        status: z.nativeEnum(APPOINTMENT_STATUS),
      })
    ),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const appointment = await db.appointment.findUnique({
          where: { id },
        });

        if (!appointment) {
          return c.json({ error: "Appointment not found" }, 404);
        }

        await db.appointment.update({
          where: { id },
          data: {
            ...data,
            date: new Date(data.date),
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
          },
        });

        return c.json({ success: "Appointment updated" }, 200);
      } catch {
        return c.json({ error: "Failed to update appointment" }, 500);
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
        status: z.nativeEnum(APPOINTMENT_STATUS),
      })
    ),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("json");

      try {
        const appointment = await db.appointment.findUnique({
          where: { id },
        });

        if (!appointment) {
          return c.json({ error: "Appointment not found" }, 404);
        }

        await db.appointment.update({
          where: { id },
          data: {
            status: data.status,
          },
        });

        return c.json({ success: "Status updated" }, 200);
      } catch {
        return c.json({ error: "Failed to update status" }, 500);
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
        const appointment = await db.appointment.findUnique({ where: { id } });

        if (!appointment) {
          return c.json({ error: "Appointment not found" }, 404);
        }

        await db.appointment.delete({ where: { id } });

        return c.json({ success: "Appointment deleted" }, 200);
      } catch {
        return c.json({ error: "Failed to delete appointment" }, 500);
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
        date: z.string().optional(),
      })
    ),
    async (c) => {
      const {
        query,
        page,
        limit,
        sort,
        status,
        date: dateString,
      } = c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const date = dateString
        ? new Date(
            new Date(dateString).setDate(new Date(dateString).getDate() - 1)
          )
        : null;

      const [appointments, totalCount] = await Promise.all([
        db.appointment.findMany({
          where: {
            ...(query && {
              patient: { name: { contains: query, mode: "insensitive" } },
            }),
            ...(status && { status: status }),
            ...(date && { date: { gte: new Date(date), lte: new Date(date) } }),
          },
          include: {
            doctor: true,
            patient: true,
            service: true,
          },
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
        }),
        db.appointment.count({
          where: {
            ...(query && {
              patient: { name: { contains: query, mode: "insensitive" } },
            }),
            ...(status && { status: status }),
            ...(date && { date: { gte: new Date(date), lte: new Date(date) } }),
          },
        }),
      ]);
      return c.json({ appointments, totalCount });
    }
  )
  .get(
    "/calendar",
    zValidator(
      "query",
      z.object({
        month: z.string().optional(),
      })
    ),
    async (c) => {
      const { month } = c.req.valid("query");

      let startMonth = startOfMonth(new Date());
      let endMonth = endOfMonth(new Date());

      if (month) {
        startMonth = startOfMonth(new Date(month));
        endMonth = endOfMonth(new Date(month));
      }
      const appointments = await db.appointment.findMany({
        where: {
          updatedAt: {
            gte: startMonth,
            lte: endMonth,
          },
        },
        include: {
          doctor: true,
          patient: true,
          service: true,
        },
      });

      const appointmentDetailsByDate: AppointmentsByDate = appointments.reduce(
        (acc, item) => {
          const date = item.updatedAt.toLocaleDateString("en-US");
          const doctorName = item.doctor?.name;

          if (!doctorName) return acc;

          let dateEntry = acc.find((entry) => entry.date === date);

          if (!dateEntry) {
            dateEntry = {
              date,
              count: 0,
              appointments: [],
            };
            acc.push(dateEntry);
          }

          let doctorEntry = dateEntry.appointments.find(
            (entry) => entry.name === doctorName
          );

          if (doctorEntry) {
            doctorEntry.count += 1;
            doctorEntry.appointments.push(item);
          } else {
            dateEntry.appointments.push({
              name: doctorName,
              count: 1,
              appointments: [item],
            });
          }

          dateEntry.count += 1;

          return acc;
        },
        [] as AppointmentsByDate
      );

      const appointmentDaybyDay = Array.from(
        { length: getDaysInMonth(new Date()) },
        (_, index) => {
          const arrayDate = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            index + 1
          ).toLocaleDateString("en-US");
          const day = appointmentDetailsByDate.find(
            (entry) => entry.date === arrayDate
          );

          if (!day) {
            return {
              date: arrayDate,
              count: 0,
              appointments: [],
            };
          }
          return day;
        }
      );
      return c.json({ appointments: appointmentDaybyDay });
    }
  );
export default app;
