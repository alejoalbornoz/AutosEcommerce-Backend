import { pool } from "./pool";

export async function testDbConnection() {
  const res = await pool.query("SELECT 1");
  console.log("DB OK:", res.rows);
}
