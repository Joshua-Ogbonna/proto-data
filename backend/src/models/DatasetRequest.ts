import mongoose, { Document, Schema } from "mongoose";

export interface IDatasetRequest extends Document {
  userId: string;
  dataTypes: string[];
  useCase: string;
  dataSize: string;
  format: string;
  additionalRequirements?: string;
  organization: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

const DatasetRequestSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  dataTypes: [
    {
      type: String,
      required: true,
    },
  ],
  useCase: {
    type: String,
    required: true,
  },
  dataSize: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  additionalRequirements: String,
  organization: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IDatasetRequest>(
  "DatasetRequest",
  DatasetRequestSchema
);
