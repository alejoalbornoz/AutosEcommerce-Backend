import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";
import { generateAccessToken } from "../utils/jwt";


export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y password requeridos" });
  }

  try {
    const user = await registerUser(email, password);
    return res.status(201).json(user);
  } catch (error: any) {
    if (error.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({ message: "Email ya registrado" });
    }

    console.error(error);
    return res.status(500).json({ message: "Error interno" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  res.status(200).json({
    accessToken,
    user,
  });
}
