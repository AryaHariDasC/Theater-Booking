import express from 'express';
import { registerTheaterController, loginTheaterController, createScreenController, createSeatsController, getScreenController, createMovieController, getMovieWithAvailableSeatsController, getScreenDetailsController } from '../controller/theaterController';
import { authMiddleware, authorizeRoles } from '../middleware/authMiddleware';
import { loginV, registerV, createV, createSV, createMV } from '../validators';
import { response } from '../helper/callBack';
const router = express.Router();
router.post('/registerTheater', registerV.theaterRegisterSchemas, response(registerTheaterController));
router.post('/loginTheater', loginV.theaterLoginSchemas, response(loginTheaterController))
router.post('/createScreen', authMiddleware, createV.screenCreateValidators, response(createScreenController))
router.get('/getAllScreen/:name', response(getScreenController))
router.post('/createSeat', authMiddleware, createSV.createSeatsValidators, response(createSeatsController));
router.post('/createMovie', authMiddleware, createMV.createMovieValidators, response(createMovieController));
router.get('/GetMovieDetails', response(getMovieWithAvailableSeatsController))
router.get('/getScreenDeatils', response(getScreenDetailsController))
export default router;