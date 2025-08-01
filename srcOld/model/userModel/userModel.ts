import mongoose from 'mongoose';
import {IUser} from '../../interface/userInterface'

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String,required: true },
  role:{type:String,enum:["user","manager"],required:true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone:{type:Number,required:true,unique:true}
});

export const UserModel = mongoose.model<IUser>('User', userSchema);