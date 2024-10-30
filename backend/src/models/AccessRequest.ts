import mongoose, { Document, Schema } from "mongoose";

export interface IAccessRequest extends Document {
  email: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
}

const AccessRequestSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAccessRequest>(
  "AccessRequest",
  AccessRequestSchema
);
