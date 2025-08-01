import { Request,Response } from "express";
import { statusCode} from "../helper/statusCode";
import { ControllerResponse } from "../interface/theaterInterface";
import { IUser } from "../interface/userInterface";
import { registerUser,loginUser } from "../service/userService";


export const registerUserController = async (req: Request<{}, {}, IUser>): Promise<ControllerResponse> => {
    try {
        const result = await registerUser(req.body);
        return{statusCode:statusCode.CREATED,message:"Registered successfully",data:result};
    } catch (error: any) {
        return{statusCode:statusCode.INTERNAL_ERROR, message: "error found",data:error.array() };
    }
};
export const loginUserController = async (req: Request<{}, {}, IUser>): Promise<ControllerResponse> => {
    try {
        const result = await loginUser(req.body);
        return{statusCode:statusCode.OK,message:"Login successfull",data:result};
    } catch (error: any) {
       return{statusCode:statusCode.INTERNAL_ERROR, message:"Error found",data:error.array() };
    }
};
