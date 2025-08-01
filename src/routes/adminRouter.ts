import express from "express";
import { response } from "../helper/callback";
import { authMiddleware, authorizeRoles } from "../middleware/authMiddleware";
import {
     createTheaterController, createScreenController, getTheaterController, getScreenController, createAndUpdateSeatController,
     getSeatsByScreenIdController, createMovieController, getMovieByStatusController, createOrUpdateShowController,
     getActiveShowsController,verifyTicketTokenController,bookingStatusController,userAbleStatusController,
     theaterStatusController,screenStatusController,showStatusController,movieStatusController,ReportController     
} from "../controller/adminController";
import { createThV, createSCV, createSeatV, createMovieV, crateShowV, bookV } from "../validator/index";
const router = express.Router();

router.post("/createTheater", createThV.theaterRegisterValidator,  response(createTheaterController));

router.post('/createScreen', createSCV.createScreenValidator, authMiddleware, authorizeRoles(['admin']), response(createScreenController));

router.get("/getTheater", authMiddleware, authorizeRoles(['admin']), response(getTheaterController));

router.get("/getScreen", authMiddleware, response(getScreenController));

router.post("/createSeat", createSeatV.seatCreateValidators, authMiddleware, authorizeRoles(['admin']), response(createAndUpdateSeatController))

router.get("/getSeats", authMiddleware, authorizeRoles(['admin']), response(getSeatsByScreenIdController));

router.post("/createMovie", createMovieV.createMovieValidator, authMiddleware, authorizeRoles(['admin']), response(createMovieController))

router.get("/getMovie", authMiddleware, authorizeRoles(['admin']), response(getMovieByStatusController))

router.post("/createShow", crateShowV.showCreateValidator, authMiddleware, authorizeRoles(['admin']), response(createOrUpdateShowController))

router.get("/getAllShows", authMiddleware, response(getActiveShowsController));

router.post("/verifyToken",authMiddleware,authorizeRoles(['admin']),response(verifyTicketTokenController));

router.put("/statusChangeTheater",authMiddleware,authorizeRoles(['admin']),response(theaterStatusController));

router.put("/statusChangeShow",authMiddleware,authorizeRoles(['admin']),response(showStatusController));

router.put("/statusChangeScreen",authMiddleware,authorizeRoles(['admin']),response(screenStatusController));

router.put("/statusChangeMovie",authMiddleware,authorizeRoles(['admin']),response(movieStatusController));

router.put("/statusChangeBooking",authMiddleware,authorizeRoles(['admin']),response(bookingStatusController));

router.put("/statusChangeUser",authMiddleware,authorizeRoles(['admin']),response(userAbleStatusController));

router.get("/getReport",authMiddleware,authorizeRoles(['admin']),response(ReportController))

export default router;