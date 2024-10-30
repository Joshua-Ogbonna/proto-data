import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  items: Array<{
    tileId: string;
    price: number;
    dataType: string[];
  }>;
  total: number;
  status: "pending" | "completed" | "failed";
  stripeSessionId?: string;
  createdAt: Date;
}

const OrderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      tileId: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      dataType: [
        {
          type: String,
          required: true,
        },
      ],
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  stripeSessionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IOrder>("Order", OrderSchema);
