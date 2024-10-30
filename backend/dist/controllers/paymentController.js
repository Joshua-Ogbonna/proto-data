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
exports.getTransactionHistory = exports.handleWebhook = exports.createCheckoutSession = void 0;
const Credits_1 = __importDefault(require("../models/Credits"));
const paymentService_1 = require("../services/paymentService");
const createCheckoutSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { credits, amount } = req.body;
        const userId = req.user.userId;
        const items = [
            {
                name: "Proto Data Credits",
                description: `${credits} credits for Proto Data Portal`,
                amount,
                quantity: credits,
            },
        ];
        const session = yield (0, paymentService_1.createPaymentSession)(items, userId, "credits");
        res.json(session);
    }
    catch (error) {
        next(error);
    }
});
exports.createCheckoutSession = createCheckoutSession;
const handleWebhook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = req.headers["stripe-signature"];
        yield (0, paymentService_1.handlePaymentWebhook)(signature, req.body);
        res.json({ received: true });
    }
    catch (error) {
        next(error);
    }
});
exports.handleWebhook = handleWebhook;
const getTransactionHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === "admin";
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = isAdmin && req.path.includes("/all") ? {} : { userId };
        const transactions = yield Credits_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate("userId", "email companyName");
        const total = yield Credits_1.default.countDocuments(query);
        res.json({
            transactions,
            pagination: {
                current: page,
                total: Math.ceil(total / limit),
                hasMore: page * limit < total,
            },
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getTransactionHistory = getTransactionHistory;
