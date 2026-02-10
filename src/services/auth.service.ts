import bcrypt from "bcrypt";
import { pool } from "../db/pool";

const SALT_ROUNDS = 10;

export async function registerUser(email: string, password: string) {
  const client = await pool.connect();

  try {
    // 1. Existe el usuario?
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      throw new Error("EMAIL_ALREADY_EXISTS");
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
      [email, passwordHash]
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}
