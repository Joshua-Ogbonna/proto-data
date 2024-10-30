import { Router } from "express";
import {
  getTiles,
  getTileById,
  getTilesByBounds,
} from "../controllers/tileController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", getTiles);
router.get("/bounds", getTilesByBounds);
router.get("/:id", getTileById);

export default router;
