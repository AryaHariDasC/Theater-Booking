import { Types,ObjectId} from "mongoose"
export interface Iscreen{
   screenNo:number,
   theaterId:Types.ObjectId,
   capacity:number,
   NoOfShows:number,
   showTime:[string],
   description:string
}
export interface ControllerResponseS {
  statusCode: number;
  message?: string;
  data?: any;
}
export interface JwtPayload{
  id:ObjectId,
  email:string,
  role:"user" |"manager"
}