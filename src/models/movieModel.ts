import mongoose from 'mongoose'
import { Imovie } from '../interface/movieInterface'

const movieSchema = new mongoose.Schema<Imovie>({
    movie_name: { type: String, required: true},
    rating:{type:Number},
    duration:{type:String,required:true},
    releaseDate:{type:Date,required:true},
    language:{type:String,required:true},
    status:{type:String,enum:["Active","Inactive"],default:"Active"},
    theaterId:{type:mongoose.Schema.Types.ObjectId,
               ref:"theater",
               required:true
           }
}) 
export const movieModel=mongoose.model<Imovie>('Movie',movieSchema)