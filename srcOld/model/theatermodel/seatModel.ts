import mongoose from "mongoose";
import { ISeat } from "../../interface/seatInterface";

const seatSchema = new mongoose.Schema<ISeat>({
  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  seatType: {
    type: String,
    enum: ["silver", "golden", "platinum", "recliner"],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  booked: {
    type: Boolean,
    default: false
  }
});

export const seatModel = mongoose.model<ISeat>("Seat", seatSchema);
