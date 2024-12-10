import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

import authRouter from "@/features/auth/server/route";

const app = new Hono()
  .basePath("/api")
  .use(cors())
  .route("/auth", authRouter);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
