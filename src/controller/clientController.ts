import { Request } from "express";
import { ITheater } from "../interface/theaterInterface";
import { GetTheater, getActiveShowsService, getMovie, createBookingService, getBookingDetails, fetchSeats } from "../service/clientService";
import { statusCode } from "../helper/statusCode";
import { ControllerResponse } from "../interface/userInterface";
import { CreateShowRequest } from "../interface/showInterface";
import { createMovieRequest } from "../interface/movieInterface";
import { IBooking } from "../interface/bookingInterface";
import { CreateSeatRequest } from "../interface/seatInterface";

export const getTheaterController = async (req: Request<{}, {}, ITheater>) => {
  try {
    const result = await GetTheater()
    return { statusCode: statusCode.OK, message: "Theater fetchged successfully", data: result }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }

  }
}

export const getActiveShowsController = async (
  req: Request<{}, {}, CreateShowRequest>
): Promise<ControllerResponse> => {
  try {
    const Data = req.body;
   const {theaterId}=Data
    if (!theaterId) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        message: "Theater ID is required",
        data: null,
      };
    }

    const shows = await getActiveShowsService(Data);

    return {
      statusCode: statusCode.OK,
      message: "Active shows fetched successfully",
      data: shows,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: error.message || "Something went wrong",
      data: null,
    };
  }
};
export const getMovieController = async (req: Request<{}, {}>): Promise<ControllerResponse> => {
  try {
    const Data = req.body;
    const movie = await getMovie(Data);
    console.log(movie);
    return { statusCode: statusCode.OK, message: "Movies fetched successfully", data: movie }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message };
  }
};


export const bookSeatsController = async (req: Request<{}, {}, IBooking>): Promise<ControllerResponse> => {
  try {
    const bookngData = req.body
    const bookingDetails = await createBookingService(bookngData);
    console.log(bookingDetails);
    return { statusCode: statusCode.CREATED, message: "Booking successfull", data: bookingDetails };
  } catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message };
  }
};

export const getbookingController = async (req: Request<{}, {}, IBooking>): Promise<ControllerResponse> => {
  try {
    const { id } = (req as any).user;
    const userId = id;
    if (!userId) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        message: "User ID is required",
        data: null,
      };
    }

    const bookingDetails = await getBookingDetails(userId);

    return {
      statusCode: statusCode.OK,
      message: "Booking fetched successfully",
      data: bookingDetails
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: error.message || "Something went wrong",
      data: null,
    };
  }
};

export const getBookedOrUnBookedSeatsController = async (req: Request<{}, {}, IBooking>) => {
  try {
    const Data = req.body;
    const fetchSeat = await fetchSeats(Data);

    return {
      statusCode: statusCode.OK,
      message: "Seats fetching  Successfully",
      data: fetchSeat
    }
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      data: null
    }
  }
}