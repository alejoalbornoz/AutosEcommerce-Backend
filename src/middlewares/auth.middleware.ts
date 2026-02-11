import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token no proporcionado", 401);
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("Formato de token inválido", 401);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch {
    throw new AppError("Token inválido o expirado", 401);
  }
};
