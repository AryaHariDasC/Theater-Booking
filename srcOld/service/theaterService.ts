import jwt from 'jsonwebtoken';
import mongoose  from 'mongoose';
import { fetchDetailsByEmail, hashPassword, comparePassword,buildSeats,groupSeatsByType } from '../helper/commonHelper';
import { theaterModel } from '../model/theatermodel/theaterModel';
import { screenModel } from '../model/theatermodel/screenModel';
import { seatModel } from "../model/theatermodel/seatModel";
import { Itheater } from '../interface/theaterInterface';
import { Iscreen } from '../interface/screenInterface';
import { ISeat, SeatConfig } from '../interface/seatInterface';
import { movieModel } from '../model/theatermodel/movieModel';
import { createMovieRequest } from '../interface/movieInterface';


export const registerTheater = async (userData: Itheater) => {
    const { name, email, address, phone, password, dist, NoOfScreen, able, status, pincode } = userData;
    const emailExists = await fetchDetailsByEmail(email);
    if (emailExists) {
        throw new Error('Email already registered');
    }
    const hashedPassword = await hashPassword(password);
    const newTheater = new theaterModel({
        name,
        email,
        phone, address,
        password: hashedPassword, dist, NoOfScreen, able, status, pincode
    });

    await newTheater.save();
    return { message: 'Theater registered successfully' };
};

export const loginTheater = async (userData: Itheater) => {
    const { email, password } = userData;
    const theater = await fetchDetailsByEmail(email);
    console.log(theater)
    if (!theater) {
        throw new Error("Theater doesn't find")
    }
    const isMatch = await comparePassword(password, theater.password);
    if (!isMatch) {
        return { message: "Invalid email or password" };
    }
    const token = jwt.sign(
        { id: theater._id, email: theater.email },
        process.env.SECRET as string, {
        expiresIn: '1h',
    }

    );
    if (!token) {
        throw new Error('Token generation failed')
    }
    console.log(token)
    return {
        message: 'User logged in successfully',
        token, // Include token in return
        theater: {
            id: theater._id,
            email: theater.email,
            name: theater.name // Optional: return more user data if needed
        }
    };

};
export const createScreenService = async (screenData: Iscreen) => {
    const { screenNo, theaterId, capacity, NoOfShows, showTime, description } = screenData;

    const newScreen = new screenModel({
        screenNo, theaterId, capacity, NoOfShows, showTime, description
    });

    await newScreen.save();
    return { message: 'Screen created successfully' };
};




export const getScreensByTheaterName = async (theaterName: string) => {
  const theater = await theaterModel.findOne({ name: theaterName });

  if (!theater) {
    throw new Error("Theater not found");
  }

  const screens = await screenModel.find({ theaterId: theater._id });

  return screens;
};




export const createOrUpdateSeats = async (
  screenId: string,
  seatConfig: SeatConfig,       // number of seats per type
  seatPrices: SeatConfig        // price per seat type
): Promise<{ updated: boolean; data: any }> => {
  // 1. Delete old seats (if any)
  await seatModel.deleteMany({ screenId });

  // 2. Create new seat documents
  const newSeats: ISeat[] = [];

  const seatTypes: (keyof SeatConfig)[] = ["silver", "golden", "platinum", "recliner"];

  for (const type of seatTypes) {
    const count = seatConfig[type];
    const price = seatPrices[type];

    for (let i = 1; i <= count; i++) {
      newSeats.push({
        screenId: new mongoose.Types.ObjectId(screenId),
        seatNumber: i,
        seatType: type,
        price,
        booked: false
      });
    }
  }

  // 3. Insert new seat docs
  const inserted = await seatModel.insertMany(newSeats);
  return { updated: false, data: inserted };
};



export const createMovie = async (movieData: createMovieRequest) => {
  const { screenId, showTime } = movieData;

  // Step 1: Find movies with overlapping showtimes on the same screen
  const conflictingMovies = await movieModel.find({
    screenId,
    showTime: { $in: showTime }
  });

  // Step 2: Delete all conflicting movie documents
  if (conflictingMovies.length > 0) {
    const idsToDelete = conflictingMovies.map((movie) => movie._id);
    await movieModel.deleteMany({ _id: { $in: idsToDelete } });
  }

  // Step 3: Create new movie
  const newMovie = new movieModel(movieData);
  await newMovie.save();

  return newMovie;
};

export const getMovieDetailsByName = async (movieName: string) => {
  const movies = await movieModel.aggregate([
    {
      $match: { movie_name: movieName }
    },
    {
      $lookup: {
        from: "screens",
        localField: "screenId",
        foreignField: "_id",
        as: "screen"
      }
    },
    { $unwind: "$screen" },
    {
      $lookup: {
        from: "theaters",
        localField: "theaterId",
        foreignField: "_id",
        as: "theater"
      }
    },
    { $unwind: "$theater" }
  ]);

  if (movies.length === 0) return [];

  // Just map the movie details without querying available seats
  const simplifiedMovies = movies.map((movie) => ({
    movie_name: movie.movie_name,
    screenNo: movie.screen.screenNo,
    theaterName: movie.theater.name,
    showTime: movie.showTime
  }));

  return simplifiedMovies;
};




export const getScreenDetailsByMovieName = async (movieName: string) => {
  // 1. Find the movie and populate screen info
  const movie = await movieModel.findOne({ movie_name: movieName });

  if (!movie) {
    return null; // no such movie
  }

  // 2. Find all seats for that movie's screen
  const seats = await seatModel.find({ screenId: movie.screenId }).select("-__v");

  // 3. Build seat details
  const groupedSeats = groupSeatsByType(seats);

  // 4. Return final structured response
  return {
    movie_name: movie.movie_name,
    showTime: movie.showTime,
    screenId: movie.screenId,
    seats: groupedSeats
  };
};
