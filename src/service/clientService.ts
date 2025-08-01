import mongoose, { Types } from "mongoose";
import { theaterModel } from "../models/theaterModel"
import { showModel } from "../models/showModel"
import { parseShowTimeToDate, parseDurationToMinutes } from "../helper/commonHelper"
import { seatModel } from "../models/seatModel";
import jwt from 'jsonwebtoken'
import { screenModel } from "../models/screenModel";
import { CreateBookingRequest, IBooking } from "../interface/bookingInterface";
import { createSolutionBuilderWithWatch } from "typescript";
import { movieModel } from "../models/movieModel";
import { createMovieRequest } from "../interface/movieInterface";
import { error } from "console";
import { userModel } from "../models/userModel";
import { bookingModel } from "../models/bookingModel";
import { json } from "express";
import { CreateShowRequest } from "../interface/showInterface";

export const GetTheater = async () => {
  try {
    const theater = await theaterModel.find({ status: "Active" })
    return theater
  } catch (error: any) {
    throw error
  }
}







// export const getActiveShowsService = async (Data:CreateShowRequest) => {
//   const {theaterId}=Data
//   if (!mongoose.Types.ObjectId.isValid(theaterId)) {
//     throw new Error("Invalid theater ID");
//   }

//   const theaterObjectId = new mongoose.Types.ObjectId(theaterId);

//   const shows = await showModel.aggregate([
//     // Filter shows by theaterId and status
//     {
//       $match: {
//         status: "Active",
//         movieId: { $ne: null },
//         theaterId: theaterObjectId,
//       },
//     },
//     // Lookup movie data
//     {
//       $lookup: {
//         from: "movies",
//         localField: "movieId",
//         foreignField: "_id",
//         as: "movie",
//       },
//     },
//     {
//       $unwind: "$movie",
//     },
//     // Filter active movies only
//     {
//       $match: {
//         "movie.status": "Active",
//       },
//     },
//     // Lookup screen data
//     {
//       $lookup: {
//         from: "screens",
//         localField: "screenId",
//         foreignField: "_id",
//         as: "screen",
//       },
//     },
//     {
//       $unwind: "$screen",
//     },
//     // Final projection
//     {
//       $project: {
//         showTime: 1,
//         screenId: "$screen._id",
//         movieName: "$movie.movie_name",
//         duration: "$movie.duration",
//         releaseDate: "$movie.releaseDate",
//         screenNo: "$screen.screenNo",
//       },
//     },
//     {
//       $sort: { showTime: 1 },
//     },
//   ]);

//   // Format showTime and calculate endTime
//   const activeShows = shows.map((show) => {
//     const showStart = parseShowTimeToDate(show.showTime);
//     const durationMin = parseDurationToMinutes(show.duration);
//     const showEnd = new Date(showStart.getTime() + durationMin * 60000);

//     return {
//       movieName: show.movieName,
//       duration: show.duration,
//       screenId: show.screenId,
//       releaseDate: show.releaseDate,
//       showTime: show.showTime,
//       startTime: showStart.toLocaleTimeString(),
//       endTime: showEnd.toLocaleTimeString(),
//       screenNo: show.screenNo,
//     };
//   });

//   return activeShows;
// };

export const getActiveShowsService = async (Data: CreateShowRequest) => {
  const { theaterId, page, limit } = Data;

  if (!mongoose.Types.ObjectId.isValid(theaterId)) {
    throw new Error("Invalid theater ID");
  }

  const skip = (page - 1) * limit;

  const shows = await showModel.aggregate([
    {
      $match: {
        status: "Active",
        movieId: { $ne: null },
        theaterId: new mongoose.Types.ObjectId(theaterId),
      },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "movies",
        localField: "movieId",
        foreignField: "_id",
        as: "movie",
      },
    },
    { $unwind: "$movie" },
    {
      $match: {
        "movie.status": "Active",
      },
    },
    {
      $lookup: {
        from: "screens",
        localField: "screenId",
        foreignField: "_id",
        as: "screen",
      },
    },
    { $unwind: "$screen" },
    {
      $project: {
        _id: 1, // Include the show ID
        showTime: 1,
        screenId: "$screen._id",
        movieName: "$movie.movie_name",
        duration: "$movie.duration",
        releaseDate: "$movie.releaseDate",
        screenNo: "$screen.screenNo",
      },
    },
    { $sort: { showTime: 1 } },
  ]);

  const activeShows = shows.map((show) => {
    const showStart = parseShowTimeToDate(show.showTime);
    const durationMin = parseDurationToMinutes(show.duration);
    const showEnd = new Date(showStart.getTime() + durationMin * 60000);

    return {
      showId: show._id, 
      movieName: show.movieName,
      duration: show.duration,
      screenId: show.screenId,
      releaseDate: show.releaseDate,
      showTime: show.showTime,
      startTime: showStart.toLocaleTimeString(),
      endTime: showEnd.toLocaleTimeString(),
      screenNo: show.screenNo,
    };
  });

  return {
    currentPage: page,
    shows: activeShows,
  };
};



export const getMovie = async (data: { theaterId: string; movieName?: string }) => {
  try {
    const { theaterId, movieName } = data;

    const body: any = {
      theaterId,
      status: "Active"
    };

    if (movieName?.trim()) {
      body.movie_name = { $regex: `^${movieName.trim()}`, $options: "i" };
    }

    const movies = await movieModel.find(body);

    if (!movies.length) {
      throw new Error("No matching movies found");
    }

    return movies;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch movies");
  }
};



export const createBookingService = async (bookingData: IBooking) => {
  try {
    const { showId, seatId, userId, showTime, screenId, bookedDate } = bookingData;

    const today = new Date();
    const showDate = new Date(bookedDate);

    today.setHours(0, 0, 0, 0);
    showDate.setHours(0, 0, 0, 0);

    const diffMs = showDate.getTime() - today.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > 3) {
      throw new Error("Booking can only be made within 3 days of the show date.");
    }
    if (diffDays < 0) {
      throw new Error("Booking date must be today or a future date.");
    }
    if (!showId || !userId || !seatId || !showTime || !screenId || !bookedDate) {
      throw new Error("Required booking fields are missing");
    }

    const user = await userModel.findById(userId);
    if (!user) throw new Error("Invalid user ID");

    let seatIds: Types.ObjectId[];

    if (Array.isArray(seatId)) {
      seatIds = seatId;
    } else {
      seatIds = [seatId];
    }

    const seats = await seatModel.find({ _id: { $in: seatIds }, screenId });
    if (seats.length !== seatIds.length) {
      throw new Error("Some seats not found");
    }

    const alreadyBooked = await bookingModel.find({
      seatId: { $in: seatIds },
      showId,
      screenId,
      showTime,
      bookedDate,
    });

    if (alreadyBooked.length > 0) {
      throw new Error("These seats already booked");
    }

    const totalPrice= seats.reduce((sum, seat) => sum + seat.price, 0)
    const show = await showModel.findById(showId);
    const screen=await screenModel.findById(screenId)
    if (!screen || !screen.theaterId) throw new Error("Invalid screen ID or missing theaterId");
    if (!show || !show.movieId) throw new Error("Invalid show ID or missing movieId");
   const movie = await movieModel.findById(show.movieId);
    if (!movie || !movie.movie_name) throw new Error("Movie not found or missing name");

    const movieCode = movie.movie_name.replace(/\s+/g, '').toUpperCase().slice(0, 3);
    const seatInfo = seats
  .map(seat => `${seat.seatNumber}[${seat.seatType.toUpperCase().slice(0, 3)}]`)
  .sort() 
  .join('-');
    const timeCode = showTime.replace(':', '');
    
    const dateCode = new Date(bookedDate).toISOString().split('T')[0].replace(/-/g, '');
    const bookedId = `${movieCode}-${seatInfo}-${timeCode}-${dateCode}`;

    const [firstSeat] = seats;
    const newBooking = await bookingModel.create({
      userId,
      showId,
      theaterId:screen.theaterId,
      movieId: show.movieId, 
      screenId,
      seatId: seatIds,
      showTime,
      bookedDate,
      totalPrice,
      bookedId,
    });

    const generateTicketId = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ticketId = '';
  for (let i = 0; i < length; i++) {
    ticketId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ticketId;
};

    const newBookingId = new mongoose.Types.ObjectId(newBooking._id);
    const tickettoken = jwt.sign(
      {
        id: newBookingId,
        userId: newBooking.userId,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '4d',
      }
    );

    const ticketId = generateTicketId(6);
  

  await bookingModel.updateOne(
  { _id: newBooking._id },
  { $set: { tickettoken, ticketId } }
);

    const bookingDetails = await bookingModel.aggregate([
      {
        $match: { _id: newBookingId, status: "Active" },
      },
      {
        $lookup: {
          from: 'shows',
          localField: 'showId',
          foreignField: '_id',
          as: 'show',
        },
      },
      { $unwind: '$show' },
      {
        $lookup: {
          from: 'movies',
          localField: 'show.movieId',
          foreignField: '_id',
          as: 'movie',
        },
      },
      { $unwind: '$movie' },
      {
        $lookup: {
          from: 'screens',
          localField: 'screenId',
          foreignField: '_id',
          as: 'screen',
        },
      },
      { $unwind: '$screen' },
      {
        $lookup: {
          from: 'seats',
          localField: 'seatId',
          foreignField: '_id',
          as: 'seats',
        },
      },
      {
        $project: {
          _id: newBookingId,
          bookedId: 1,
          movieName: '$movie.movie_name',
          screenNo: '$screen.screenNo',
          showTime: 1,
          bookedDate: 1,
          totalPrice: 1,
          seats: {
            $map: {
              input: '$seats',
              as: 'seat',
              in: {
                seatNumber: '$$seat.seatNumber',
                seatType: '$$seat.seatType',
              },
            },
          },
        },
      },
    ]);

    return {
      message: "Booking successful",
      data: bookingDetails,
      tickettoken,ticketId
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};


export const getBookingDetails = async (userId: string) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid User ID");
    }
    const usersId = new mongoose.Types.ObjectId(userId)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const bookingDetails = await bookingModel.aggregate([
      {
        $match: { userId: usersId, bookedDate: { $gte: startOfToday }, status: "Active" }
      },
      {
        $lookup: {
          from: 'shows',
          localField: 'showId',
          foreignField: '_id',
          as: 'show'
        },
      },
      { $unwind: '$show' },
      {
        $lookup: {
          from: 'movies',
          localField: 'show.movieId',
          foreignField: '_id',
          as: 'movie'
        },
      }, { $unwind: '$movie' },

      {
        $lookup: {
          from: 'screens',
          localField: 'screenId',
          foreignField: '_id',
          as: 'screen',
        },
      },
      { $unwind: '$screen' },
      {
        $lookup: {
          from: 'seats',
          localField: 'seatId',
          foreignField: '_id',
          as: 'seats',
        },
      },
      {
        $project: {
          bookedId:1,
          ticketId: 1,
          movieName: '$movie.movie_name',
          screenNo: '$screen.screenNo',
          showTime: 1,
          bookedDate: 1,
          totalPrice: 1,
          seats: {
            $map: {
              input: '$seats',
              as: 'seat',
              in: {
                seatNumber: '$$seat.seatNumber',
                seatType: '$$seat.seatType',
              },
            },
          },
        },
      },

    ]);
    if (!bookingDetails.length) {
      throw new Error("Booking not found");
    }

    return {
      bookingDetails
    };
  }
  catch (error: any) {
    throw new Error(error.message);
  }

}

export const fetchSeats = async (Data: IBooking) => {
  try {
    const { showId, screenId, bookedDate } = Data
    const screenObjectId = new mongoose.Types.ObjectId(screenId);
    const showObjectId = new mongoose.Types.ObjectId(showId);

    // Convert date to full-day range
    const date = new Date(bookedDate);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));


    const bookings = await bookingModel.find({
      showId: showObjectId,
      bookedDate: { $gte: start, $lte: end }
    });


    const bookedSeatIds = bookings.flatMap(b => b.seatId.map(id => id.toString()));


    const allSeats = await seatModel.find({ screenId: screenObjectId });

    // Separate available and booked seats
    const availableSeats = allSeats.filter(seat => !bookedSeatIds.includes(seat._id.toString()));
    const bookedSeats = allSeats.filter(seat => bookedSeatIds.includes(seat._id.toString()));

    return {
      totalSeats: allSeats.length,
      availableSeats,
      bookedSeats
    };
  } catch (err: any) {
    throw new Error(err.message);
  }
};