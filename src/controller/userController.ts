import { Request } from "express";
import { Iuser,ControllerResponse } from "../interface/userInterface";
import { statusCode } from "../helper/statusCode";
import { createUser ,loginUser,getUser} from "../service/userService";


export const createUserController = async (req: Request<{}, {}, Iuser>): Promise<ControllerResponse> => {
    try {
        const result = await createUser(req.body);
        return{statusCode:statusCode.CREATED,message:"Created successfully",data:result};
    } catch (error: any) {
        return{statusCode:statusCode.INTERNAL_ERROR, message: error.message, };
    }
};
export const loginUserController = async (req: Request<{}, {}, Iuser>): Promise<ControllerResponse> => {
    try {
        const result = await loginUser(req.body);
        return{statusCode:statusCode.OK,message:"Login successfull",data:result};
    } catch (error: any) {
       return{statusCode:statusCode.INTERNAL_ERROR, message:"Error found" };
    }
};

export const getProfileUserController = async (req: Request): Promise<ControllerResponse> => {
    try {
        const userId = (req as any).user.id;
        console.log(userId)
        const user = await getUser(userId);
        if (!user) {
            return{statusCode:statusCode.NOT_FOUND, message: 'User not found'};
             };
        
        return{statusCode:statusCode.OK,
            message: 'Profile fetched successfully',
            data:user
        };
    } catch (error: any) {
       return{ statusCode:statusCode.INTERNAL_ERROR,message:"Error found"}
    
       };
    }
