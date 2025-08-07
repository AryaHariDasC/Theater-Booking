import { Types } from "mongoose";
export interface Iuser{
_id?: string;
name:string,
email:string,
phoneNo:string,
password:string,
role:"admin"|"client",
able:boolean,
otp?:string
}
export interface ControllerResponse {
  statusCode: number;
  message?: string;
  data?: any;
}
export interface JwtPayload {
    id:Types.ObjectId
    email: string;
    role:"admin"|"client"
}
