import { Router } from "express";
import {
  createDatasetRequest,
  getDatasetRequests,
  getDatasetRequestById,
  updateDatasetRequestStatus,
  deleteDatasetRequest,
} from "../controllers/datasetRequestController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(authenticate);

// User routes
router.post("/", createDatasetRequest);
router.get("/my-requests", getDatasetRequests);
router.get("/:requestId", getDatasetRequestById);

// Admin routes
router.get("/", getDatasetRequests); // All requests
router.use(authorize("admin"));
router.patch("/:requestId/status", updateDatasetRequestStatus);
router.delete("/:requestId", deleteDatasetRequest);

export default router;
