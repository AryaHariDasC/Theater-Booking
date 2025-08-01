import { ObjectId } from "mongoose";
export interface Itheater{
    name:string,
    email:string,
    phone:number,
    address:string,
    password:string,
    NoOfScreen:number,
    dist:string,
    able:boolean,
    status:string,
    pincode:number,
    _id:ObjectId
}
export interface ControllerResponse {
  statusCode: number;
  message?: string;
  data?: any;
}
// export interface CustomJwtPayload{
//     id:string
// }