import mongoose from "mongoose";
import { Itheater  } from "../../interface/theaterInterface";
const theaterSchema = new mongoose.Schema<Itheater>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    NoOfScreen: { type: Number, required: true },
    dist:{type:String,required:true},
    able: { type: Boolean, default: true },
    status: { type: String, enum: ["open", "close"], default: "open" },
    pincode: { type: Number, required: true }
})
export const theaterModel = mongoose.model<Itheater>('Theater', theaterSchema);