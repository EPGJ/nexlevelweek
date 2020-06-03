import express from "express";
import PointsController from "./controllers/PointsController"
import ItemsController from "./controllers/ItemsController"
const router = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();
router.get("/items", itemsController.index);
router.get("/points/:idPoint", pointsController.show);
router.get("/points", pointsController.index);
router.post("/points", pointsController.create)

export default router;
