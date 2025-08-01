import { ObjectId } from "mongoose";
export interface IUser {
    name: string;
    email: string;
    role:"user"|"manager";
    password: string;
    phone:number,
     _id: ObjectId;
      __v: number;
}
export interface JwtPayload {
    id: string;
    email: string;
}
