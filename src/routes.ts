import { Router } from "express";
import { AppError } from "./utils/AppError";

export const routes = Router();

routes.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

routes.get("/error", () => {
  throw new AppError("Esto es un error controlado", 400);
});
