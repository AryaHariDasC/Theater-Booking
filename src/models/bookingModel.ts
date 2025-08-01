import mongoose, { Schema, Types } from "mongoose";
import { IBooking } from "../interface/bookingInterface";
const bookingSchema = new Schema<IBooking>({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  showId: { type: Schema.Types.ObjectId, ref: "show", required: true },
  seatId: [{ type: Schema.Types.ObjectId, ref: "seat", required: true }],
  screenId: { type: Schema.Types.ObjectId, ref: "screen", required: true, },
  showTime: { type: String, required: true },
  movieId:{type:Schema.Types.ObjectId,ref:"Movie"},
  theaterId:{type:Schema.Types.ObjectId,ref:"theater"},
  bookedDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  tickettoken: { type: String ,default:null},
   used: { type: Boolean, default: false },
   status:{type:String,enum:["Active","Inactive"],default:"Active"},
   bookedId:{type:String,required:true},
   ticketId:{type:String}
}, { timestamps: true });

export const bookingModel = mongoose.model<IBooking>("Booking", bookingSchema);

