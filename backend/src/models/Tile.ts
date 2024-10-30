import mongoose, { Document, Schema } from "mongoose";

export interface ITile extends Document {
  id: string;
  coordinates: number[][][];
  properties: {
    coverage: number;
    availableImagery: string[];
    labelingStatus: string;
    lastUpdated: Date;
    accuracyScore: number;
    price: number;
  };
  region: string;
  country: string;
}

const TileSchema = new Schema({
  coordinates: {
    type: [[Number]],
    required: true,
  },
  properties: {
    coverage: {
      type: Number,
      required: true,
    },
    availableImagery: [
      {
        type: String,
        enum: ["3D", "Satellite", "Street View", "Labeled"],
      },
    ],
    labelingStatus: {
      type: String,
      enum: ["Unlabeled", "In Progress", "Completed"],
      default: "Unlabeled",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    accuracyScore: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  region: String,
  country: String,
});

export default mongoose.model<ITile>("Tile", TileSchema);
