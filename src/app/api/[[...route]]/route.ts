import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

import authRouter from "@/features/auth/server/route";
import patientRouter from "@/features/dashboard/patients/server/route";
import doctorRouter from "@/features/dashboard/doctors/server/route";
import treatmentRouter from "@/features/dashboard/treatments/server/route";
import medicineRouter from "@/features/dashboard/medicines/server/route";
import serviceRouter from "@/features/dashboard/services/server/route";
import appointmentRouter from "@/features/dashboard/appointments/server/route";
import paymentsRouter from "@/features/dashboard/payments/server/route";
import dashboardRouter from "@/features/dashboard/server/route";

const app = new Hono()
  .basePath("/api")
  .use(cors())
  .route("/auth", authRouter)
  .route("/patients", patientRouter)
  .route("/doctors", doctorRouter)
  .route("/treatments", treatmentRouter)
  .route("/medicines", medicineRouter)
  .route("/services", serviceRouter)
  .route("/appointments", appointmentRouter)
  .route("/payments", paymentsRouter)
  .route("/dashboard", dashboardRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
