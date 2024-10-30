import { Router } from "express";
import {
  createCheckoutSession,
  handleStripeWebhook,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// Public route for Stripe webhook
router.post("/webhook", handleStripeWebhook);

// Protected routes
router.use(authenticate);

// User routes
router.post("/checkout", createCheckoutSession);
router.get("/my-orders", getOrders);
router.get("/:orderId", getOrderById);

// Admin routes
router.use(authorize("admin"));
router.patch("/:orderId/status", updateOrderStatus);

export default router;
