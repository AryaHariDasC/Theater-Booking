import mongoose from "mongoose";
import { ISeat } from "../interface/seatInterface";
const seatSchema=new mongoose.Schema<any>({
    screenId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Screen",
        required:true
    },
    seatNumber:{
        type:Number,
        required:true
    },
    seatType:{
        type:String,
        enum:["silver","gold","platinum","recliner"],
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})
export const seatModel=mongoose.model<any>("seat",seatSchema)