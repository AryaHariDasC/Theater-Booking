import mongoose from "mongoose";
import { Iscreen } from "../interface/screenInterface";

const ScreenSchema=new mongoose.Schema<Iscreen>({
    screenNo:{type:Number,required:true,unique:true},
       theaterId:{type:mongoose.Schema.Types.ObjectId,
           ref:"theater",
           required:true
       },
       NoOfShows:{type:Number,required:true},
       showTime:{type:[String],required:true},
       status:{type:String,enum:["Active","Inactive"],default:"Active"},
       description:{type:String,required:true}  
   })
   export const screenModel=mongoose.model<Iscreen>('screen',ScreenSchema)