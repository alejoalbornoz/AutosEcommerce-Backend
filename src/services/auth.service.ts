import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool";
import { AppError } from "../utils/AppError";

const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string) {
  const client = await pool.connect();

  try {
    // 1. Existe el usuario?
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );

    if (existing.rows.length > 0) {
      throw new AppError("El usuario ya existe", 409);
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Insert
    const result = await client.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING id, email, role, created_at
      `,
      [email, passwordHash],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export const loginUser = async (email: string, password: string) => {
  // 1️⃣ Buscar usuario
  const result = await pool.query(
    `
    SELECT id, email, password_hash, role, is_active
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  if (!result.rowCount || result.rowCount === 0) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const user = result.rows[0];

  // 2️⃣ Verificar si está activo
  if (!user.is_active) {
    throw new AppError("Usuario desactivado", 403);
  }

  // 3️⃣ Comparar password
  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new AppError("Credenciales inválidas", 401);
  }

  // 4️⃣ Devolver datos básicos (JWT viene después)
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};
