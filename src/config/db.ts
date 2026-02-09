import { Pool } from "pg";
import { logger } from "../utils/logger";

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

db.on("connect", () => {
  logger.info("🟢 PostgreSQL connected");
});

db.on("error", (err) => {
  logger.error({
    message: "PostgreSQL error",
    error: err,
  });
});
