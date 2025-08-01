import mongoose from 'mongoose'
import { checkSchema } from "express-validator";
import { bookingModel } from "../models/bookingModel";

const bookingValidator=()=>checkSchema({
  userId: {
    in: ['body'],
    notEmpty: { errorMessage: 'User ID is required' },
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: 'Invalid User ID',
    },
  },
  showId: {
    in: ['body'],
    notEmpty: { errorMessage: 'Show ID is required' },
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: 'Invalid Show ID',
    },
  },
  screenId: {
    in: ['body'],
    notEmpty: { errorMessage: 'Screen ID is required' },
    custom: {
      options: (value) => mongoose.Types.ObjectId.isValid(value),
      errorMessage: 'Invalid Screen ID',
    },
  },
  seatId: {
    in: ['body'],
    notEmpty: { errorMessage: 'Seat ID(s) are required' },
    custom: {
      options: (value) => {
        if (Array.isArray(value)) {
          return value.every((id) => mongoose.Types.ObjectId.isValid(id));
        }
        return mongoose.Types.ObjectId.isValid(value);
      },
      errorMessage: 'One or more Seat IDs are invalid',
    },
  }
})

export const bookingValidators=(errorFormatter:any)=>({
    bookingValidator:[bookingValidator(),errorFormatter]
})