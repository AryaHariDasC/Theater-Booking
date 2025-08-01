import { Request } from "express";
import { ITheater } from "../interface/theaterInterface";
import {
  createScreen, createTheater, getScreens, GetTheater, createOrUpdateSeats, getSeatsByScreenIdService,
  createMovie, getMovieByStatus, createOrUpdateShowService, getActiveShowsService, verifyTicket,
  theaterStatusService, showStatusService, screenStatusService, movieStatusService, bookingStatusService, userAbleStatusService,
  getFlexibleReport
} from "../service/adminSevice";
import { statusCode } from "../helper/statusCode";
import { userModel } from "../models/userModel";
import { Iscreen } from "../interface/screenInterface";
import { CreateSeatRequest } from "../interface/seatInterface"
import { ControllerResponse } from "../interface/userInterface";
import { createMovieRequest } from "../interface/movieInterface";
import { CreateShowRequest } from "../interface//showInterface";






export const createTheaterController = async (req: Request<{}, {}, ITheater>,) => {
  try {

    const Data = req.body
    const { id } = (req as any).user
    const adminId = id
    Data.adminId = adminId
    const result = await createTheater(Data)
    return {
      statusCode: statusCode.OK,
      message: "Theater Created Successfully",
      data: result
    }

  } catch (error: any) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: error.message,
      data: null
    }
  }
}


export const createScreenController = async (req: Request<{}, {}, Iscreen>) => {
  try {
    const screenData = req.body
    const result = await createScreen(screenData)
    return { statusCode: statusCode.OK, message: "Screen Created Successfully", data: result }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}

export const getTheaterController = async (req: Request<{}, {}, ITheater>) => {
  try {
    const { id } = (req as any).user
    const adminId = id;
    const result = await GetTheater(adminId)
    return { statusCode: statusCode.OK, message: "Theater fetched successfully", data: result }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }

  }
}

export const getScreenController = async (req: Request<{}, {}, Iscreen>) => {
  try {
    const screenData = req.body
    const result = await getScreens(screenData)
    return { statusCode: statusCode.OK, message: "Screens fetched successfully", data: result }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }

  }
}

export const createAndUpdateSeatController = async (
  req: Request<{}, {}, CreateSeatRequest>
) => {
  try {
    const { screenId, silver, gold, platinum, recliner, price } = req.body;
    console.log(req.body);

    const result = await createOrUpdateSeats({
      screenId,
      silver,
      gold,
      platinum,
      recliner,
      price,
    });
    return {
      statusCode: 200,
      message: "Seats created successfully",
      data: result,
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      message: error.message,
      data: null,
    };
  }
};


export const getSeatsByScreenIdController = async (req: Request<{}, {}, CreateSeatRequest>): Promise<ControllerResponse> => {
  try {
    const Data = req.body;
    const seats = await getSeatsByScreenIdService(Data);
    console.log(seats);
    return { statusCode: statusCode.OK, message: "Seats fetched successfully", data: seats }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message };
  }
};


export const createMovieController = async (req: Request<{}, {}, createMovieRequest>): Promise<ControllerResponse> => {
  const { movie_name, rating, language, duration, releaseDate, status, theaterId } = req.body;

  if (!movie_name || !duration || !releaseDate || !language || !status || !theaterId) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: "Missing or invalid movie details"
    };
  }

  try {
    const newMovie = await createMovie({ movie_name, rating, language, duration, releaseDate, status, theaterId });

    return {
      statusCode: statusCode.CREATED,
      message: "Movie created successfully",
      data: newMovie
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: error.message
    };
  }
};
export const getMovieByStatusController = async (req: Request<{}, {}, createMovieRequest>): Promise<ControllerResponse> => {
  try {
    const result = await getMovieByStatus();
    console.log(result);

    return { statusCode: statusCode.OK, message: "Movies fetched successfully", data: result }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message };
  }
};



export const createOrUpdateShowController = async (
  req: Request<{}, {}, CreateShowRequest>,): Promise<ControllerResponse> => {
  try {
    const result = await createOrUpdateShowService(req.body);
    return {
      statusCode: statusCode.OK,
      message: "Show created/updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR, message: "Failed to create or update show",
    };
  }
};



export const getActiveShowsController = async (req: Request): Promise<ControllerResponse> => {
  try {

    const shows = await getActiveShowsService();
    return {
      statusCode: statusCode.OK, message: "Active shows fetched successfully", data: shows
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR, message: error.message, data: null,
    };
  }
};
export const verifyTicketTokenController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { ticketId } = req.body;
    const result = await verifyTicket(ticketId); 
    return {statusCode:statusCode.OK,data: result};
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
     
      message: error.message || 'Error verifying ticket',
    };
  }
};


export const theaterStatusController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { theaterId } = req.body
    const { status } = req.body
    const result = await theaterStatusService(theaterId, status);
    if (!result) {
      return { statusCode: statusCode.BAD_REQUEST, message: "Not matching or bad request" };
    }
    return { statusCode: statusCode.OK, message: "Theater status changed" }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}



export const showStatusController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { showId } = req.body
    const { status } = req.body
    const result = await showStatusService(showId, status);
    if (!result) {
      return { statusCode: statusCode.BAD_REQUEST, message: "Not matching or bad request" };
    }
    return { statusCode: statusCode.OK, message: "Show status changed" }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}

export const screenStatusController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { screenId } = req.body
    const { status } = req.body
    const result = await screenStatusService(screenId, status);
    if (!result) {
      return { statusCode: statusCode.BAD_REQUEST, message: "Not matching or bad request" };
    }
    return { statusCode: statusCode.OK, message: "Screen status changed" }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}

export const movieStatusController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { movieId } = req.body
    const { status } = req.body
    const result = await movieStatusService(movieId, status);
    if (!result) {
      return { statusCode: statusCode.BAD_REQUEST, message: "Not matching or bad request" };
    }
    return { statusCode: statusCode.OK, message: "Movie status changed" }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}

export const bookingStatusController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { bookingId } = req.body
    const { status } = req.body
    const result = await bookingStatusService(bookingId, status);
    if (!result) {
      return { statusCode: statusCode.BAD_REQUEST, message: "Not matching or bad request" };
    }
    return { statusCode: statusCode.OK, message: "Booking  status changed" }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}


export const userAbleStatusController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const { userId } = req.body
    const { able } = req.body
    const result = await userAbleStatusService(userId, able);
    if (!result) {
      return { statusCode: statusCode.BAD_REQUEST, message: "Not matching or bad request" };
    }
    return { statusCode: statusCode.OK, message: "User able status changed" }
  }
  catch (error: any) {
    return { statusCode: statusCode.INTERNAL_ERROR, message: error.message }
  }
}



export const ReportController = async (req: Request): Promise<ControllerResponse> => {
  try {
    const {
      screenId,
      movieId,
      theaterId,
      seatType,
      status,
      used,
     fromDate,toDate,
      showId
    } = req.body;

  
    if (!screenId &&!movieId &&!theaterId &&!seatType &&!fromDate &&!toDate &&!showId) {
      return {
        statusCode: statusCode.BAD_REQUEST,
        message: "At least one filter (e.g., screenId, movieId, bookedDate, etc.) is required"
      };
    }

    const result = await getFlexibleReport({
      screenId,
      movieId,
      theaterId,
      seatType,
      status,
      used,
      fromDate,
      toDate,
      showId
    });

    return {
      statusCode: statusCode.OK,
      message: "Report fetched successfully",
      data: result
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: error.message || "Something went wrong"
    };
  }
};

