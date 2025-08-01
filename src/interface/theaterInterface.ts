import { Types } from "mongoose";

export interface ITheater {
    _id: Types.ObjectId;
    name: string;
    address: string;
    phone: number;
    email: string;
    able: boolean;
    _v: number;
    city: string;
    state: string;
    pincode: number;
    id:string
    adminId:Types.ObjectId,
    status:"Active" | "Inactive"
}