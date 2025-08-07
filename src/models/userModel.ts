import mongoose, { Types } from "mongoose";
import { Iuser } from "../interface/userInterface";
const userSchema=new mongoose.Schema<Iuser>({
name:{type:String,required:true},
email:{type:String,required:true,unique:true},
phoneNo:{type:String,required:true,unique:true},
password:{type:String,required:true},
role:{type:String,enum:["admin","client"],default:"client"},
able:{type:Boolean,default:true},
otp:{type:String}
});
export const userModel=mongoose.model<Iuser>('user',userSchema)