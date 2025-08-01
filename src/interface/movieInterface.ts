import { Types } from "mongoose";
export interface Imovie{
    movie_name:string,
    releaseDate:Date
    rating:number
    duration:string
    language:string,
    status:"Active" |"Inactive",
    theaterId:Types.ObjectId;
}
export interface createMovieRequest{
    movie_name:string,       
    rating:number,
    releaseDate:Date,
    duration:string
    language:string,
    status:"Active"|"Inactive",
    theaterId:Types.ObjectId;
}