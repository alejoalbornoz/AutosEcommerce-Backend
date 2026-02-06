import express from "express";

export const app = express();
// import cors from "cors";
// import { routes } from "./routes";
// import { errorHandler } from "./middlewares/error.middleware";

// app.use(cors());
app.use(express.json());

// app.use("/api", routes);

// app.use(errorHandler);
