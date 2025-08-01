import { Types } from "mongoose";
export interface Iuser{
_id:Types.ObjectId
name:string,
email:string,
phoneNo:number,
password:string,
role:"admin"|"client",
able:boolean
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
