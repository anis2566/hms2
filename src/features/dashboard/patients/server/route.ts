import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import {
  MedicalRecordSchema,
  PatientSchema,
  PatientWithImageSchema,
} from "../schemas";
import { sessionMiddleware, isAdmin } from "@/lib/session-middleware";
import { db } from "@/lib/db";
import { uploadFile } from "@/features/uploader/action";
import { revalidatePath } from "next/cache";

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
  .put(
    "/edit/withImage/:id",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ id: z.string() })),
    zValidator("form", PatientWithImageSchema),
    async (c) => {
      const id = await c.req.param("id");
      const data = await c.req.valid("form");

      try {
        const patient = await db.patient.findUnique({
          where: { id },
        });

        if (!patient) {
          return c.json({ error: "Patient not found" }, 404);
        }

        let imageUrl = null;
        if (data.imageUrl) {
          imageUrl = await uploadFile({
            file: data.imageUrl,
            path: "patients",
            name: id,
            extension: "png",
          });
        }

        await db.patient.update({
          where: { id },
          data: {
            ...data,
            imageUrl,
          },
        });

        revalidatePath(`/dashboard/patients/${id}`);

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
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
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
  )
  .get("/doctorsForSelect", sessionMiddleware, isAdmin, async (c) => {
    const doctors = await db.doctor.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return c.json({ doctors });
  })
  .get("/treatmentsForSelect", sessionMiddleware, isAdmin, async (c) => {
    const treatments = await db.treatment.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return c.json({ treatments });
  })
  .get("/medicinesForSelect", sessionMiddleware, isAdmin, async (c) => {
    const medicines = await db.medicine.findMany({
      select: {
        id: true,
        name: true,
        price: true,
      },
    });
    return c.json({ medicines });
  })
  .post(
    "/medicalRecord",
    sessionMiddleware,
    isAdmin,
    zValidator("json", MedicalRecordSchema),
    async (c) => {
      const body = await c.req.valid("json");
      try {
        const record = await db.medicalRecord.create({
          data: {
            complains: body.complains,
            diagnosis: body.diagnosis,
            vitalSigns: body.vitalSigns,
            doctorId: body.doctorId,
            patientId: body.patientId,
            treatments: {
              create: body.treatments.map((treatment) => ({
                treatmentId: treatment,
              })),
            },
            medicines: {
              createMany: {
                data: body.medicines.map((medicine) => ({
                  frequency: medicine.frequency,
                  instruction: medicine.instruction,
                  quantity: medicine.quantity,
                  dosageQuantity: medicine.dosageQuantity,
                  dosage: medicine.dosage,
                  medicineId: medicine.medicineId,
                })),
              },
            },
          },
        });
        return c.json({
          success: "Medical record created",
          id: record.patientId,
        });
      } catch (error) {
        console.log(error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    }
  )
  .get(
    "/medicalRecords/:patientId",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ patientId: z.string() })),
    zValidator("query", z.object({ page: z.string().optional() })),
    async (c) => {
      const patientId = await c.req.param("patientId");
      const { page } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = 3;

      const [medicalRecords, totalCount] = await Promise.all([
        db.medicalRecord.findMany({
          where: { patientId },
          include: {
            treatments: {
              include: {
                treatment: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            medicines: {
              include: {
                medicine: {
                  select: {
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
          orderBy: {
            createdAt: "desc",
          },
        }),
        db.medicalRecord.count({
          where: { patientId },
        }),
      ]);
      return c.json({ medicalRecords, totalCount });
    }
  )
  .get(
    "/appointments/:patientId",
    sessionMiddleware,
    isAdmin,
    zValidator("param", z.object({ patientId: z.string() })),
    zValidator(
      "query",
      z.object({
        page: z.string().optional(),
        limit: z.string().optional(),
        sort: z.string().optional(),
      })
    ),
    async (c) => {
      const patientId = await c.req.param("patientId");
      const { page, limit, sort } = await c.req.valid("query");

      const pageNumber = parseInt(page || "1");
      const limitNumber = parseInt(limit || "5");

      const [appointments, totalCount] = await Promise.all([
        db.appointment.findMany({
          where: { patientId },
          include: {
            doctor: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                phone: true,
              },
            },
          },
          skip: (pageNumber - 1) * limitNumber,
          take: limitNumber,
          orderBy: {
            ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
          },
        }),
        db.appointment.count({
          where: { patientId },
        }),
      ]);
      return c.json({ appointments, totalCount });
    }
  );

export default app;
