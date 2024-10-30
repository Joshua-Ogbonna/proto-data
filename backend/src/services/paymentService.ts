import Stripe from "stripe";
import Order from "../models/Order";
import { ApiError } from "../utils/ApiError";
import { stripe } from "../utils/Stripe";
import Credits from "../models/Credits";
import User from "../models/User";

interface LineItem {
  name: string;
  description: string;
  amount: number;
  quantity?: number;
}

export const createPaymentSession = async (
  items: LineItem[],
  userId: string,
  type: "order" | "credits"
) => {
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/${type}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/${type}/cancel`,
      metadata: {
        userId,
        type,
        ...(type === "credits" && { credits: items[0].quantity }),
        ...(type === "order" && { orderId: "" }),
      },
    });

    // Create the appropriate record based on type
    if (type === "order") {
      await Order.create({
        userId,
        items: items.map((item) => ({
          name: item.name,
          description: item.description,
          amount: item.amount,
          quantity: item.quantity,
        })),
        total: items.reduce(
          (sum, item) => sum + item.amount * (item.quantity || 1),
          0
        ),
        stripeSessionId: session.id,
        status: "pending",
      });
    } else {
      await Credits.create({
        userId,
        amount: items[0].quantity!,
        transactionType: "purchase",
        description: `Purchase of ${items[0].quantity} credits`,
        stripeSessionId: session.id,
        status: "pending",
      });
    }

    return { sessionId: session.id };
  } catch (error) {
    throw new ApiError(400, "Failed to create payment session");
  }
};

export const handlePaymentWebhook = async (signature: string, payload: any) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, type, credits, orderId } = session.metadata!;

      if (type === "credits") {
        // Handle credits purchase
        const creditTransaction = await Credits.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: "completed" },
          { new: true }
        );

        if (!creditTransaction) {
          throw new Error("Credit transaction not found");
        }

        // Update user's credit balance
        const user = await User.findByIdAndUpdate(
          userId,
          { $inc: { credits: Number(credits) } },
          { new: true }
        );

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
      } else {
        // Handle order purchase
        const order = await Order.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: "completed" },
          { new: true }
        );

        if (!order) {
          throw new Error("Order not found");
        }

        // Send order confirmation email
        const user = await User.findById(userId);
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
  } catch (error) {
    throw new ApiError(400, "Webhook error");
  }
};
