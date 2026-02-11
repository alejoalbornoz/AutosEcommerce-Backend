import jwt from "jsonwebtoken";
import { AppError } from "./AppError";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new AppError("JWT_SECRET no definido", 500);
}

export const generateAccessToken = (payload: {
  id: string;
  role: string;
}) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
};
