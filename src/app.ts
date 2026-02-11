import express from "express";
import "dotenv/config";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import morgan from "morgan";
import { routes } from "./routes";
import { errorHandler } from "./middlewares/error.middleware";

import { testDbConnection } from "./db/testConnection";

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());

testDbConnection();

app.use("/auth", authRoutes);
app.use("/api", routes);

app.use(errorHandler);

export default app;
