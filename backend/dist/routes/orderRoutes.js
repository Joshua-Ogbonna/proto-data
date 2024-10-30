"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public route for Stripe webhook
router.post("/webhook", orderController_1.handleStripeWebhook);
// Protected routes
router.use(auth_1.authenticate);
// User routes
router.post("/checkout", orderController_1.createCheckoutSession);
router.get("/my-orders", orderController_1.getOrders);
router.get("/:orderId", orderController_1.getOrderById);
// Admin routes
router.use((0, auth_1.authorize)("admin"));
router.patch("/:orderId/status", orderController_1.updateOrderStatus);
exports.default = router;
