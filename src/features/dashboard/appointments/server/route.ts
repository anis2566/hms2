import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/lib/db";
import { isAdmin, sessionMiddleware } from "@/lib/session-middleware";
import { APPOINTMENT_STATUS } from "@/constant";
import { endOfMonth, getDaysInMonth, startOfMonth } from "date-fns";
import { Appointment, Patient, Service } from "@prisma/client";

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
  )
  .get(
    "/",
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
