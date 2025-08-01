import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { IBooking, Modifier, TicketPayload } from "../interface/bookingInterface"
import { parseShowTimeToDate, parseDurationToMinutes } from "../helper/commonHelper"
import { theaterModel } from "../models/theaterModel";
import { ITheater } from "../interface/theaterInterface";
import { Iscreen } from "../interface/screenInterface";
import { CreateSeatRequest } from "../interface/seatInterface";
import { screenModel } from "../models/screenModel";
import { seatModel } from "../models/seatModel";
import { movieModel } from "../models/movieModel";
import { Types } from "mongoose";
import { createMovieRequest } from "../interface/movieInterface";
import { showModel } from "../models/showModel";
import { CreateShowRequest, Ishow } from "../interface/showInterface"
import { bookingModel } from "../models/bookingModel";
import { error } from "console";
import { userModel } from "../models/userModel";

export const createTheater = async (Data: ITheater) => {
    try {
        // const Existtheater=await theaterModel.find({email:Data.email});
        // if(Existtheater.length>0){
        //     throw new Error("Theater already exists");
        // }
        // const phoneExist=await theaterModel.find({phoneNo:Data.phoneNo})
        // if(phoneExist.length>0){
        //     throw new Error("Phone number alreday exist")
        // }
        const theater = new theaterModel(Data);
        const result = await theater.save();
        return result;
    } catch (error: any) {
        throw error;
    }
}

export const createScreen = async (screenData: Iscreen) => {
    try {
        const screen = new screenModel(screenData)
        const result = await screen.save();
        return result;
    }
    catch (error: any) {
        throw error;
    }
}

export const GetTheater = async (adminId: string) => {
    try {
        const theater = await theaterModel.find({ adminId: adminId, status: "Active" })
        if (!theater) {
            throw new Error(" Active theater is not available ")
        }
        return theater
    } catch (error: any) {
        throw error
    }
}

export const getScreens = async (screenData: Iscreen) => {
    try {
        const { theaterId } = screenData
        const theater = await screenModel.find({ theaterId: theaterId, status: "Active" });
        if (!theater) {
            throw new Error("Screen not found")
        }
        return theater
    } catch (error: any) {
        throw error
    }
}

export const createOrUpdateSeats = async (data: CreateSeatRequest) => {
    try {
        const { screenId, silver, gold, platinum, recliner, price } = data;
        const screen = await screenModel.findById(screenId);
        if (!screen) {
            throw new Error("Screen not found");
        }

        console.log(price);

        const seatTypes = [
            { type: "silver", count: silver, price: price.silverP },
            { type: "gold", count: gold, price: price.goldP },
            { type: "platinum", count: platinum, price: price.platinumP },
            { type: "recliner", count: recliner, price: price.reclinerP },
        ];



        for (const { type, count, price: seatPrice } of seatTypes) {

            if (count != null && count >= 0) {
                const currentSeats = await seatModel.find({ screenId, seatType: type }).sort({ seatNumber: 1 });
                const currentCount = currentSeats.length;

                // 1. If new count > current count → ADD seats
                if (count > currentCount) {
                    for (let i = currentCount; i < count; i++) {
                        await new seatModel({
                            screenId,
                            seatNumber: i + 1,
                            seatType: type,
                            price: seatPrice,
                            booked: false,
                        }).save();
                    }
                }

                // 2. If new count < current count → REMOVE extra seats from the end
                if (count < currentCount) {
                    for (let i = currentCount - 1; i >= count; i--) {
                        await seatModel.findOneAndDelete({
                            screenId,
                            seatNumber: i + 1,
                            seatType: type,
                        });
                    }
                }

                // 3. Update price of all remaining seats of this type
                await seatModel.updateMany(
                    { screenId, seatType: type },
                    { $set: { price: seatPrice } }
                );
            }
        }
    } catch (error: any) {
        console.log(error);
        throw error;
    }
};



export const getSeatsByScreenIdService = async (Data: CreateSeatRequest) => {
    try {
        const screenId = Data.screenId
        const result = await seatModel.find({ screenId });
        if (result.length < 1) {
            throw error
        }
        return result;
    }
    catch (error: any) {
        throw error
    }
};

export const createMovie = async (movieData: createMovieRequest) => {
    try {


        const existMovie = await movieModel.find({ movie_name: movieData.movie_name, theaterId: movieData.theaterId });
        if (existMovie.length > 0) {
            throw new Error("Movie existing in this theater")
        }
        //  Create new movie
        const newMovie = new movieModel(movieData);
        await newMovie.save();
        return newMovie;
    }
    catch (error: any) {
        throw error
    }
};

export const getMovieByStatus = async () => {
    try {
        const movie = await movieModel.find({ status: "Active" });
        const result = movie;
        return result;
    }
    catch (error: any) {
        throw error
    }
};




export const createOrUpdateShowService = async ({
    screenId,
    movieId,
    showTime,
    status, theaterId, showEndDate
}: CreateShowRequest): Promise<{ message: string; data: any }> => {
    const screenObjectId = new mongoose.Types.ObjectId(screenId);
    const movieObjectId = new mongoose.Types.ObjectId(movieId);
    const theaterObjectId = new mongoose.Types.ObjectId(theaterId)

    // Check screen
    const screen = await screenModel.findById(screenObjectId);
    if (!screen) throw new Error("Screen not found");

    if (!screen.showTime.includes(showTime)) {
        throw new Error(`Show time '${showTime}' is not configured for this screen`);
    }

    // Check movie
    const movie = await movieModel.findById(movieObjectId);
    if (!movie || movie.status !== "Active") {
        throw new Error("Movie not found or is not active");
    }



    //  Step 1: Do upsert with updateOne
    const result = await showModel.updateOne(
        { screenId: screenObjectId, showTime, status, theaterId: theaterObjectId, showEndDate },
        { $set: { movieId: movieObjectId } },
        { upsert: true }

    );
    console.log(result);
    // Step 2: Fetch the updated or inserted document
    const updatedDoc = await showModel.findOne({ screenId: screenObjectId, showTime, status, theaterId: theaterObjectId, showEndDate });

    return {
        message: "Show created/updated successfully",
        data: updatedDoc,
    };
};



export const getActiveShowsService = async () => {
    const shows = await showModel
        .find({ status: "Active", movieId: { $ne: null } })
        .populate({
            path: "movieId",
            // select: "movie_name duration status releaseDate", //  Include releaseDate here
        })
        .populate({
            path: "screenId",
            select: "screenNo theaterId",
        })
        .sort({ showTime: 1 });

    const activeShows = shows
        .filter((show) => {
            const movie = show.movieId as any;
            return movie?.status === "Active";
        })
        .map((show) => {
            const movie = show.movieId as any;
            const screen = show.screenId as any;

            const showStart = parseShowTimeToDate(show.showTime);
            const durationMin = parseDurationToMinutes(movie.duration);
            const showEnd = new Date(showStart.getTime() + durationMin * 60000);

            return {
                movieName: movie.movie_name,
                duration: movie.duration,
                releaseDate: movie.releaseDate, // Add this to the response
                showTime: show.showTime,
                startTime: showStart.toLocaleTimeString(),
                endTime: showEnd.toLocaleTimeString(),
                screenNo: screen.screenNo,
            };
        });

    return activeShows;
};


export const verifyTicket = async (ticketId: string) => {
  try {
    const booking = await bookingModel.findOne({ ticketId });
    if (!booking) {
      return { success: false, status: 'not_found', message: 'Ticket not found' };
    }

    if (booking.used) {
      return { success: false, status: 'used', message: 'Ticket already used' };
    }

    const bookedDate: Date = booking.bookedDate;
    const showTime: string = booking.showTime; // e.g. "02:30 PM"
    const now = new Date();

    const bookedDateStr = bookedDate.toISOString().split("T")[0];
    const todayStr = now.toISOString().split("T")[0];
    const isBookedDateToday = bookedDateStr === todayStr;

    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();

    const [time, modifier] = showTime.split(" "); // e.g. "02:30 PM"
    let [showHours, showMinutes] = time.split(":").map(Number);

    if (modifier === "PM" && showHours !== 12) showHours += 12;
    if (modifier === "AM" && showHours === 12) showHours = 0;

    const isShowTimePassed =
      nowHours > showHours || (nowHours === showHours && nowMinutes >= showMinutes);

    if (isBookedDateToday && isShowTimePassed) {
      return { success: false, status: 'expired', message: 'Ticket has expired' };
    }

    if (isBookedDateToday) {
      booking.used = true;
      await booking.save();

      return {
        success: true,
        status: 'valid',
        message: 'Ticket is valid for today',
        data: booking,
      };
    }

    return {
      success: false,
      status: 'future',
      message: 'Ticket is for a different date',
    };
  } catch (error: any) {
    return {
      success: false,
      status: 'error',
      message: error.message || 'Error verifying ticket',
    };
  }
};


export const theaterStatusService = async (theaterId: string, status: string) => {
  const theater = await theaterModel.findById(theaterId);
  if (!theater) {
    throw new Error('Theater not found');
  }

  const newStatus = status === "Active" ? "Active" : "Inactive";

  // Update theater status
  theater.status = newStatus;
  await theater.save();

  // Update screens in this theater
  await screenModel.updateMany(
    { theaterId: theater._id },
    { $set: { status: newStatus } }
  );

  // Update shows in this theater
  await showModel.updateMany(
    { theaterId: theater._id },
    { $set: { status: newStatus } }
  );

  return {
    success: true,
    message: `Theater, its screens, and shows have been set to ${newStatus} successfully`,
    theater,
  };
};




export const showStatusService = async (showId: string, status: string) => {
    const show = await showModel.findById(showId);
    if (!show) {
        throw new Error('Show not found');
    }

    show.status = status === "Active" ? "Active" : "Inactive";
    await show.save();

    return { success: true, message: 'Show status changed successfully', show };
};

export const screenStatusService = async (screenId: string, status: string) => {
  const screen = await screenModel.findById(screenId);
  if (!screen) {
    throw new Error('Screen not found');
  }

  const newStatus = status === "Active" ? "Active" : "Inactive";

  screen.status = newStatus;
  await screen.save();

  await showModel.updateMany(
    { screenId: screen._id },
    { $set: { status: newStatus } }
  );

  return {
    success: true,
    message: `Screen and its shows set to ${newStatus} successfully`,
    screen,
  };
};
export const movieStatusService = async (movieId: string, status: string) => {
    const movie = await movieModel.findById(movieId);
    if (!movie) {
        throw new Error('Movie not found');
    }

    movie.status = status === "Active" ? "Active" : "Inactive";
    await movie.save();

    return { success: true, message: ' Movie status changed successfully', movie };
};


export const bookingStatusService = async (bookingId: string, status: string) => {
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    booking.status = status === "Active" ? "Active" : "Inactive";
    await booking.save();

    return { success: true, message: 'Booking status changed successfully', booking };
};

export const userAbleStatusService = async (userId: string, able: boolean) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.able = able === true ? true : false
    await user.save();
    return { success: true, message: 'User able status changed successfully', user };
};





export const getFlexibleReport = async (filters: {
  screenId?: string;
  movieId?: string;
  theaterId?: string;
  seatType?: string;
  showId?: string;
  fromDate?: string;
  toDate?: string;
  status?: "Active" | "Inactive";
  used?: boolean;
}) => {
  if (!filters.fromDate || !filters.toDate) {
    throw new Error("Both fromDate and toDate are required");
  }

  const startDate = new Date(filters.fromDate.split('T')[0] + 'T00:00:00.000Z');
  const endDate = new Date(filters.toDate.split('T')[0] + 'T23:59:59.999Z');

  const {
    screenId,
    movieId,
    theaterId,
    seatType,
    showId,
    status,
    used
  } = filters;

  const matchStage: any = {
    bookedDate: { $gte: startDate, $lte: endDate },
  };

  if (status) matchStage.status = status;
  if (typeof used === "boolean") matchStage.used = used;

  if (screenId && mongoose.Types.ObjectId.isValid(screenId)) {
    matchStage.screenId = new mongoose.Types.ObjectId(screenId);
  }
  if (showId && mongoose.Types.ObjectId.isValid(showId)) {
    matchStage.showId = new mongoose.Types.ObjectId(showId);
  }

  const pipeline: any[] = [
    { $match: matchStage },
    { $unwind: "$seatId" },
    {
      $lookup: {
        from: "seats",
        localField: "seatId",
        foreignField: "_id",
        as: "seat"
      }
    },
    { $unwind: "$seat" },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "shows",
        localField: "showId",
        foreignField: "_id",
        as: "show"
      }
    },
    { $unwind: "$show" },
    {
      $lookup: {
        from: "movies",
        localField: "show.movieId",
        foreignField: "_id",
        as: "movie"
      }
    },
    { $unwind: "$movie" },
    {
      $lookup: {
        from: "screens",
        localField: "screenId",
        foreignField: "_id",
        as: "screen"
      }
    },
    { $unwind: "$screen" },

    ...(movieId && mongoose.Types.ObjectId.isValid(movieId)
      ? [{ $match: { "show.movieId": new mongoose.Types.ObjectId(movieId) } }]
      : []),

    ...(theaterId && mongoose.Types.ObjectId.isValid(theaterId)
      ? [{ $match: { "screen.theaterId": new mongoose.Types.ObjectId(theaterId) } }]
      : []),

    ...(seatType ? [{ $match: { "seat.seatType": seatType } }] : []),

    {
      $group: {
        _id: "$_id",
        ticketId: { $first: "$ticketId" },
        bookedId: { $first: "$bookedId" },
        userName: { $first: "$user.name" },
        seatTypes: { $addToSet: "$seat.seatType" },
        price: { $sum: "$seat.price" },
        screenNo: { $first: "$screen.screenNo" },
        movieName: { $first: "$movie.movie_name" },
        bookedDate: { $first: "$bookedDate" },
        used: { $first: "$used" },
        status: { $first: "$status" }
      }
    },
    {
      $group: {
        _id: null,
        bookings: { $push: "$$ROOT" },
        totalAmount: { $sum: "$price" }
      }
    },
    {
      $project: {
        _id: 0,
        bookings: 1,
        totalAmount: 1
      }
    }
  ];

  const result = await bookingModel.aggregate(pipeline);
  return result[0] || { bookings: [], totalAmount: 0 };
};



