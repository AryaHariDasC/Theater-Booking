
import { Types } from "mongoose";

export interface Ishow {
  _id?: Types.ObjectId;
  screenId: Types.ObjectId;
  movieId: Types.ObjectId | null; // nullable when slot is vacant
  theaterId:Types.ObjectId;
  showTime: string;
  status?: "Active" | "Inactive";
  previousMovie?: {
    movieId: Types.ObjectId;
    removedAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateShowRequest {
  showEndDate:Date;                               
  screenId: string;
  movieId: string;
  theaterId:string;
  showTime: string;
   page:number;
  limit:number;
  status:"Active"|"Inactive"
}
