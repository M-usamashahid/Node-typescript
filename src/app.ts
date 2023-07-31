import express, { Router } from "express";
import 'express-async-errors';
import { expressConfig } from "../src/config/express";
import { errorHandler } from "../src/middlewares/error-handler";
import seed from "./seed";

import router from "./routes";

const app = express();

expressConfig(app);

const apiRoutes = Router();

app.use("/api", apiRoutes);

// Apply Seed data
seed(apiRoutes)

// Router funtion for binding all the api routes
router(apiRoutes);

app.get("/ping", (req: any, res: any) => res.send("Working"));

app.use(errorHandler);

export { app };