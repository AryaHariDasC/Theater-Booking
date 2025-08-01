import { Types } from 'mongoose';

export interface ISeat {
  screenId: Types.ObjectId;
  seatNumber: number;
  seatType: "silver" | "gold" | "platinum" | "recliner";
  price: number;
  booked: boolean;
}

export interface CreateSeatRequest {
  screenId: Types.ObjectId;
  seatNumber?: number;
  seatType?: "silver" | "gold" | "platinum" | "recliner";
  booked?: boolean;
  silver: number;
  gold: number;
  platinum: number;
  recliner: number; 
  price: SeatConfigP;
}
// export interface SeatTypeCongig{

// }
export interface SeatConfigP {
  silverP: number;
  goldP: number;
  platinumP: number;
  reclinerP: number;
}
