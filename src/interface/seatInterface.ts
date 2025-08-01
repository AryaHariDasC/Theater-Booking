import { Types } from 'mongoose'

export interface ISeat {
  screenId: Types.ObjectId;
  seatNumber: number;
  seatType: "silver" | "gold" | "platinum" | "recliner";
  price: number;
}


export interface CreateSeatRequest {
  screenId: Types.ObjectId;
  silver: number;
  gold: number;
  platinum: number;
  recliner: number;
  price: SeatConfigP;
  // _id:Types.ObjectId
  // _v:number
}


export interface SeatConfigP {
  silverP: number;
  goldP: number;
  platinumP: number;
  reclinerP: number;
}
