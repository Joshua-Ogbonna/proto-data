"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datasetRequestController_1 = require("../controllers/datasetRequestController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.authenticate);
// User routes
router.post("/", datasetRequestController_1.createDatasetRequest);
router.get("/my-requests", datasetRequestController_1.getDatasetRequests);
router.get("/:requestId", datasetRequestController_1.getDatasetRequestById);
// Admin routes
router.get("/", datasetRequestController_1.getDatasetRequests); // All requests
router.use((0, auth_1.authorize)("admin"));
router.patch("/:requestId/status", datasetRequestController_1.updateDatasetRequestStatus);
router.delete("/:requestId", datasetRequestController_1.deleteDatasetRequest);
exports.default = router;
