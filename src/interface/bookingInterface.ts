import { Types } from "mongoose";

export interface IBooking {
  userId: Types.ObjectId;
  bookedDate: Date;
  showId: Types.ObjectId;
  seatId: Types.ObjectId[];
  showTime: string;
  screenId: Types.ObjectId
  totalPrice: number;
  _id: Types.ObjectId;
  tickettoken: string;
  movieId:Types.ObjectId;
  theaterId:Types.ObjectId;
  used?: boolean,
  status:"Active" | "Inactive",
  bookedId:string,
  ticketId:string
}


export interface CreateBookingRequest {
  bookedDate: Date;
  showId: string;
  seatId: string;
  showTime: string;
  screenId: string;
  movieId:Types.ObjectId;
  theaterId:Types.ObjectId;
  userId: string; // Optional if you're not authenticating
  totalPrice: String;
  tickettoken: string;
  used?: boolean;
  status:"Active" | "Inactive",
  bookedId:string,
  ticketId:string
}
export interface BookingResponse {
  movie: string;
  screen: number;
  theater: string;
  seatNumber: number;
  movieId:Types.ObjectId;
  theaterId:Types.ObjectId;
  screenId: string;
  seatType: "silver" | "gold" | "platinum" | "recliner";
  showTime: string;
  totalPrice: number;
  tickettoken: string;
  used?: boolean,
  status:"Active" | "Inactive",
  bookedId:string,
  ticketId:string
}
export interface TicketPayload {
  id: string;
  userId: string;
}

export enum Modifier {
  AM = "am",
  PM = "pm"
}
