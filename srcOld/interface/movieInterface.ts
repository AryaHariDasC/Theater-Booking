import { Types } from "mongoose";
export interface Imovie{
    movie_name:string,
    theaterId:Types.ObjectId | string,
    screenId:Types.ObjectId | string,
    showTime:string[] | string
}
export interface createMovieRequest{
    movie_name:string,
    theaterId:string,       
    screenId:string,
    showTime:string
}