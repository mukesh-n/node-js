import express from "express";
import { ActionRes } from "../global/model/actionres.model";
import { userneed } from "../models/project.model"
import { userneedService } from "../service/project.service"
const router = express.Router();
router.get("/entity", async (req, res, next) => {
  try {
    var result: ActionRes<userneed> = new ActionRes<userneed>({
      item: new userneed({}),
    });
    next(result);
  } catch (error) {
    next(error);
  }
});
router.post("/get", async (req, res, next) => {
  try {
    var result: ActionRes<Array<userneed>> = new ActionRes<
      Array<userneed>
    >();
    var service: userneedService = new userneedService();
    result.item = await service.select(req.body.item);
    next(result);
  } catch (error) {
    next(error);
  }
});
router.post("/insert", async (req, res, next) => {
  try {
    var result: ActionRes<userneed> = new ActionRes<userneed>();
    var service: userneedService = new userneedService();
    result.item = await service.insert(req.body.item);
    next(result);
  } catch (error) {
    next(error);
  }
});
router.post("/update", async (req, res, next) => {
    try {
      var result: ActionRes<userneed> = new ActionRes<userneed>();
      var service: userneedService = new userneedService();
      result.item = await service.update(req.body.item);
      next(result);
    } catch (error) {
      next(error);
    }
  });

export { router as userneedController };
