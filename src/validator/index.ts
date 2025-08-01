import { Request,Response,NextFunction } from "express";
import { validationResult } from "express-validator";
import { statusCode } from "../helper/statusCode";
import { userSchemaChecks,userLoginSchemaChecks } from "./userValidator";
import {createTheaterTValidators,createScreenSValidators,seatCreateValidator,
    createMovieValidators,showCreateValidators} from '../validator/adminValidator'
import { bookingValidators } from "./clientvalidator";
const errorFormatter = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "Validation errors",
            data: errors.array(),
        });
        return;
    }
    next();
};
export const createUv=userSchemaChecks(errorFormatter);
export const loginUv=userLoginSchemaChecks(errorFormatter);
export const createThV=createTheaterTValidators(errorFormatter);
export const createSCV=createScreenSValidators(errorFormatter);
export const createSeatV=seatCreateValidator(errorFormatter)
export const createMovieV=createMovieValidators(errorFormatter)
export const crateShowV=showCreateValidators(errorFormatter)
export const bookV=bookingValidators(errorFormatter)