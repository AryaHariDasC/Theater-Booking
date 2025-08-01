import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { statusCode } from "../helper/statusCode";
import { registerTValidators,loginTValidators,createSValidators,createSevalidators,createMValidators } from './theaterValidator';
import {userSchemaChecks} from './userValidator'

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
export const loginV = loginTValidators(errorFormatter);
export const registerV = registerTValidators(errorFormatter);
export const createV = createSValidators(errorFormatter);
export const createSV=createSevalidators(errorFormatter);
export const  createMV=createMValidators(errorFormatter);
export const  userC=userSchemaChecks(errorFormatter)