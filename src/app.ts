import express from "express";
import "dotenv/config";

import { testDbConnection } from "./db/testConnection";


export const app = express();
// import cors from "cors";
// import { routes } from "./routes";
// import { errorHandler } from "./middlewares/error.middleware";

// app.use(cors());
app.use(express.json());

testDbConnection()

// app.use("/api", routes);

// app.use(errorHandler);


export default app;


