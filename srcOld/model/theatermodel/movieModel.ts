import mongoose from 'mongoose'
import { Imovie } from '../../interface/movieInterface'

const movieSchema = new mongoose.Schema<Imovie>({
    movie_name: { type: String, required: true },
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theater",
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },
     showTime:{type:[String],required:true},
   
})
export const movieModel=mongoose.model<Imovie>('Movie',movieSchema)