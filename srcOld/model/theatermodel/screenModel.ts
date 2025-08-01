import mongoose from 'mongoose';
import { Iscreen } from '../../interface/screenInterface';

const screenSchema=new mongoose.Schema<Iscreen>({
    screenNo:{type:Number,required:true,unique:true},
    theaterId:{type:mongoose.Schema.Types.ObjectId,
        ref:"Theater",
        required:true
    },
    capacity:{type:Number,required:true},
    NoOfShows:{type:Number,required:true},
    showTime:{type:[String],required:true},
    description:{type:String,required:true}  
})
export const screenModel=mongoose.model<Iscreen>('Screen',screenSchema)