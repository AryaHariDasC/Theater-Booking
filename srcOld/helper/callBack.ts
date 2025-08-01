import { Request, Response, NextFunction } from "express";
import { ControllerResponse } from "../interface/theaterInterface";



export const response = (
    controller: (req: Request, res: Response, next: NextFunction) => Promise<ControllerResponse> ) =>
{
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { statusCode, message, data } = await controller(req, res, next);
            res.status(statusCode).json({
                success: statusCode < 400,
                message,
                data: data || null,
            });
        } catch (error) {
            console.error("Internal Error:", error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: null
            });
        }
    };
};
