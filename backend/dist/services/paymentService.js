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
exports.handlePaymentWebhook = exports.createPaymentSession = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const ApiError_1 = require("../utils/ApiError");
const Stripe_1 = require("../utils/Stripe");
const Credits_1 = __importDefault(require("../models/Credits"));
const User_1 = __importDefault(require("../models/User"));
const createPaymentSession = (items, userId, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lineItems = items.map((item) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    description: item.description,
                },
                unit_amount: Math.round(item.amount * 100), // Convert to cents
            },
            quantity: item.quantity || 1,
        }));
        const session = yield Stripe_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/${type}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/${type}/cancel`,
            metadata: Object.assign(Object.assign({ userId,
                type }, (type === "credits" && { credits: items[0].quantity })), (type === "order" && { orderId: "" })),
        });
        // Create the appropriate record based on type
        if (type === "order") {
            yield Order_1.default.create({
                userId,
                items: items.map((item) => ({
                    name: item.name,
                    description: item.description,
                    amount: item.amount,
                    quantity: item.quantity,
                })),
                total: items.reduce((sum, item) => sum + item.amount * (item.quantity || 1), 0),
                stripeSessionId: session.id,
                status: "pending",
            });
        }
        else {
            yield Credits_1.default.create({
                userId,
                amount: items[0].quantity,
                transactionType: "purchase",
                description: `Purchase of ${items[0].quantity} credits`,
                stripeSessionId: session.id,
                status: "pending",
            });
        }
        return { sessionId: session.id };
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, "Failed to create payment session");
    }
});
exports.createPaymentSession = createPaymentSession;
const handlePaymentWebhook = (signature, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = Stripe_1.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { userId, type, credits, orderId } = session.metadata;
            if (type === "credits") {
                // Handle credits purchase
                const creditTransaction = yield Credits_1.default.findOneAndUpdate({ stripeSessionId: session.id }, { status: "completed" }, { new: true });
                if (!creditTransaction) {
                    throw new Error("Credit transaction not found");
                }
                // Update user's credit balance
                const user = yield User_1.default.findByIdAndUpdate(userId, { $inc: { credits: Number(credits) } }, { new: true });
                // Send confirmation email
                // await sendEmail({
                //   to: user!.email,
                //   subject: "Credits Purchase Confirmation",
                //   template: "creditsPurchaseConfirmation",
                //   data: {
                //     credits,
                //     total: session.amount_total! / 100,
                //     user,
                //   },
                // });
            }
            else {
                // Handle order purchase
                const order = yield Order_1.default.findOneAndUpdate({ stripeSessionId: session.id }, { status: "completed" }, { new: true });
                if (!order) {
                    throw new Error("Order not found");
                }
                // Send order confirmation email
                const user = yield User_1.default.findById(userId);
                // await sendEmail({
                //   to: user!.email,
                //   subject: "Order Confirmation",
                //   template: "orderConfirmation",
                //   data: {
                //     order,
                //     user,
                //   },
                // });
            }
        }
        return true;
    }
    catch (error) {
        throw new ApiError_1.ApiError(400, "Webhook error");
    }
});
exports.handlePaymentWebhook = handlePaymentWebhook;
