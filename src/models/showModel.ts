
import mongoose, { Schema } from "mongoose";

const showSchema = new Schema(
  {
    screenId: {
      type: Schema.Types.ObjectId,
      ref: "screen",
      required: true,
    },
    movieId: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      // nullable when slot is vacant
    },
    theaterId:{
      type:Schema.Types.ObjectId,
      ref:"theater"
    },
    showTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    showEndDate:{
      type:Date
    },
    previousMovie: {
      movieId: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
      removedAt: {
        type: Date,
      }
    }
  },
  { timestamps: true }
);



//Automatically infers the type from schema
export type ShowDocument = mongoose.InferSchemaType<typeof showSchema>;

export const showModel = mongoose.model("show", showSchema);
