"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public webhook endpoint (this should be in main routes if not already there)
router.post('/webhook', paymentController_1.handleWebhook);
// Protected routes - require authentication
router.use(auth_1.authenticate);
// Credit purchase
router.post('/create-checkout', paymentController_1.createCheckoutSession);
// Credit balance and history
router.get('/transactions', paymentController_1.getTransactionHistory);
// Admin routes
router.use((0, auth_1.authorize)('admin'));
router.get('/transactions/all', paymentController_1.getTransactionHistory);
exports.default = router;
