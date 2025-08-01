import { Types } from "mongoose";
export interface Iscreen{
    screenNo:number,
    showTime:string[],
    NoOfShows:number,
    status:"Active"|"Inactive",
    description:string,
    theaterId:Types.ObjectId,
    _id:Types.ObjectId
}