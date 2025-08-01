import mongoose from "mongoose";
import { ITheater } from "../interface/theaterInterface";
const theaterSchema = new mongoose.Schema<ITheater>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  status:{type:String,enum:["Active","Inactive"],default:"Active"}
});
export const theaterModel = mongoose.model<ITheater>("theater", theaterSchema);