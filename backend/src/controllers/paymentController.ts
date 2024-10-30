import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Credits from "../models/Credits";
import {
  createPaymentSession,
  handlePaymentWebhook,
} from "../services/paymentService";
import { ApiError } from "../utils/ApiError";

export const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const session = await createPaymentSession(items, userId, "credits");
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const signature = req.headers["stripe-signature"]!;
    await handlePaymentWebhook(signature as unknown as string, req.body);
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const getTransactionHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === "admin";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const query = isAdmin && req.path.includes("/all") ? {} : { userId };

    const transactions = await Credits.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "email companyName");

    const total = await Credits.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    next(error);
  }
};
