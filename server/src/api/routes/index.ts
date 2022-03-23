import { exampleRouter } from "./exampleRouter";
import express from "express";

const apiRouter = express.Router();

apiRouter.use("/example", exampleRouter);

export { apiRouter };
