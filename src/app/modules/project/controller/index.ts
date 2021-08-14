import express from "express";
import { Environment } from "../global/utils";
import { userneedController } from "../controller/project.controller";
const router = express.Router();
const environment = Environment.getInstance();

router.use("/userneed", userneedController);


export { router as ProjectRoutes };