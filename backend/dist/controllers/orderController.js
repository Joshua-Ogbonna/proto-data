"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.handleStripeWebhook = exports.createCheckoutSession = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const paymentService_1 = require("../services/paymentService");
const ApiError_1 = require("../utils/ApiError");
const createCheckoutSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        const userId = req.user.userId;
        const session = yield (0, paymentService_1.createPaymentSession)(items, userId, 'order');
        res.json(session);
    }
    catch (error) {
        next(error);
    }
});
exports.createCheckoutSession = createCheckoutSession;
const handleStripeWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.headers['stripe-signature'];
        yield (0, paymentService_1.handlePaymentWebhook)(signature, req.body);
        res.json({ received: true });
    }
    catch (error) {
        next(error);
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
const getOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';
        const query = isAdmin ? {} : { userId };
        const orders = yield Order_1.default.find(query).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrders = getOrders;
const getOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';
        const order = yield Order_1.default.findById(orderId);
        if (!order) {
            throw new ApiError_1.ApiError(404, 'Order not found');
        }
        // Check if user has permission to view this order
        if (!isAdmin && order.userId !== userId) {
            throw new ApiError_1.ApiError(403, 'Not authorized to view this order');
        }
        res.json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.getOrderById = getOrderById;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = yield Order_1.default.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            throw new ApiError_1.ApiError(404, 'Order not found');
        }
        res.json(order);
    }
    catch (error) {
        next(error);
    }
});
exports.updateOrderStatus = updateOrderStatus;
