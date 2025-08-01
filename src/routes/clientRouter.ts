import express from "express";
import { response } from "../helper/callback";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware";
import {
    getActiveShowsController, getTheaterController, getMovieController, bookSeatsController, getbookingController,
    getBookedOrUnBookedSeatsController
} from "../controller/clientController";
import { bookV } from "../validator/index";

const router = express.Router()

router.get("/GetTheater", authMiddleware, authorizeRoles(['client']), response(getTheaterController));

router.get("/GetShows", authMiddleware, authorizeRoles(['client']), response(getActiveShowsController));

router.get("/GetMovies", authMiddleware, authorizeRoles(['client']), response(getMovieController))

router.post("/createBook", bookV.bookingValidator, authMiddleware, authorizeRoles(['client']), response(bookSeatsController));

router.get("/getBookDetails", authMiddleware, authorizeRoles(['client']), response(getbookingController))

router.get("/getAvailableSeats", authMiddleware, authorizeRoles(['client']), response(getBookedOrUnBookedSeatsController))

export default router;