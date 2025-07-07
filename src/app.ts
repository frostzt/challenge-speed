import dotenv from "dotenv";
import express from "express";
import { globalErrorHandler } from "./middlewares/global-error-handler";
import { identificationController } from "./identification/identification.controller";
import "reflect-metadata";
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/identify", identificationController);

// Attach global error handler
app.use(globalErrorHandler);

// Initialize application
AppDataSource.initialize()
  .then(async () => {
    app.listen(process.env.PORT, () => {
      console.log(`App listening on ${process.env.PORT}`);
    });
  })
  .catch(console.error);
