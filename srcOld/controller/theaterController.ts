import { Request, Response } from 'express';
import { loginTheater, registerTheater, createScreenService, getScreensByTheaterName, createMovie, createOrUpdateSeats,getMovieDetailsByName,getScreenDetailsByMovieName } from '../service/theaterService';
import { ControllerResponse, Itheater } from '../interface/theaterInterface';
import { statusCode } from '../helper/statusCode';
import { Iscreen, ControllerResponseS } from '../interface/screenInterface';
import {  CreateSeatRequest,ISeat,SeatConfig } from '../interface/seatInterface';
import { createMovieRequest, Imovie } from '../interface/movieInterface';


export const registerTheaterController = async (req: Request<{}, {}, Itheater>): Promise<ControllerResponse> => {
    try {
        const userData = req.body
        const result = await registerTheater(userData);
        return { statusCode: statusCode.CREATED, message: "Registered successfully", data: result };
    } catch (error: any) {
        return { statusCode: statusCode.INTERNAL_ERROR, message: "error found", data: error.array() };
    }
};
export const loginTheaterController = async (req: Request<{}, {}, Itheater>): Promise<ControllerResponse> => {
    try {
        const result = await loginTheater(req.body);
        return { statusCode: statusCode.OK, message: "Login successfull", data: result };
    } catch (error: any) {
        return { statusCode: statusCode.INTERNAL_ERROR, message: "Error found", data: error.array() };
    }
};
export const createScreenController = async (req: Request<{}, {}, Iscreen>): Promise<ControllerResponseS> => {
    try {
        const screenData = req.body
        const { id } = (req as any).user
        const theaterId = id
        screenData.theaterId = theaterId
        const result = await createScreenService(screenData)
        console.log(result)
        return { statusCode: statusCode.OK, message: "Created successfully", data: result }
    } catch (error: any) {
        return { statusCode: statusCode.INTERNAL_ERROR, message: "Creation failed", data: error.array() }
    }
};


export const getScreenController = async (req: Request): Promise<ControllerResponse> => {
    try {
        const theaterName = req.params.name as string;

        if (!theaterName) {
            return {
                statusCode: statusCode.BAD_REQUEST,
                message: "Theater name is required"
            };
        }

        const screens = await getScreensByTheaterName(theaterName);

        if (!screens.length) {
            return {
                statusCode: statusCode.NOT_FOUND,
                message: "No screens found for this theater"
            };
        }

        return {
            statusCode: statusCode.OK,
            message: "Screens fetched successfully",
            data: screens
        };
    } catch (error: any) {
        return {
            statusCode: statusCode.INTERNAL_ERROR,
            message: error.message || "Error fetching screens"
        };
    }
};


export const createSeatsController = async (
  req: Request<{}, {}, CreateSeatRequest>
): Promise<ControllerResponse> => {
  const { screenId, silver, golden, platinum, recliner, price } = req.body;

  // Validate seat count fields
  if (
    !screenId ||
    silver == null || golden == null || platinum == null || recliner == null ||
    !price ||
    price.silver == null || price.golden == null || price.platinum == null || price.recliner == null
  ) {
    return {
      statusCode: statusCode.BAD_REQUEST,
      message: "Missing required fields (seat counts or prices)"
    };
  }

  try {
    const seatConfig: SeatConfig = { silver, golden, platinum, recliner };
    const seatPrices: SeatConfig = price;

    const result = await createOrUpdateSeats(screenId, seatConfig, seatPrices);

    return {
      statusCode: statusCode.CREATED,
      message: "Seats created/updated successfully",
      data: result
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: "Internal server error",
      data: error?.message || error
    };
  }
};


export const createMovieController = async (req: Request<{}, {}, createMovieRequest>): Promise<ControllerResponse> => {
    const { movie_name, theaterId, screenId, showTime } = req.body;

    if (!movie_name || !theaterId || !screenId || !Array.isArray(showTime) || showTime.length === 0) {
        return {
            statusCode: statusCode.BAD_REQUEST,
            message: "Missing or invalid movie details"
        };
    }

    try {
        const newMovie = await createMovie({ movie_name, theaterId, screenId, showTime });

        return {
            statusCode: statusCode.CREATED,
            message: "Movie created successfully",
            data: newMovie
        };
    } catch (error: any) {
        return {
            statusCode: statusCode.INTERNAL_ERROR,
            message: "Failed to create movie",
            data: error?.message || error
        };
    }
};


export const getMovieWithAvailableSeatsController = async (
  req: Request
): Promise<ControllerResponse> => {
  try {
    const movieName = req.body.movie_name as string;

    if (!movieName || movieName.trim() === "") {
      return {
        statusCode: statusCode.BAD_REQUEST,
        message: "Please provide a movie name",
        data: null
      };
    }

    const result = await getMovieDetailsByName(movieName);

    if (result.length === 0) {
      return {
        statusCode: statusCode.NOT_FOUND,
        message: `No movie found with name "${movieName}"`,
        data: null
      };
    }

    return {
      statusCode: statusCode.OK,
      message: "Movie details fetched",
      data: result
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: "Error fetching movie seat details",
      data: error.message || error
    };
  }
};




export const getScreenDetailsController = async (req: Request<{},{},Imovie>):Promise<ControllerResponse> => {
  try {
    const { movie_name,screenId } = req.body;

    if (!movie_name) {
      return {statusCode:statusCode.BAD_REQUEST,
        message: "Movie name is required"}
      }
      if(!screenId){
        {
      return {statusCode:statusCode.BAD_REQUEST,
        message: "Screen Id name is invalid"}
      }
      }
    const result = await getScreenDetailsByMovieName(movie_name);

    if (!result) {
      return {statusCode:statusCode.NOT_FOUND,message: "No movie found with the given name"
      };
    }

    return {statusCode:statusCode.OK,message: "Screen details fetched successfully",data: result
    };
  } catch (error: any) {
    return {statusCode:statusCode.INTERNAL_ERROR,
      message: "Something went wrong"};
  }
};

