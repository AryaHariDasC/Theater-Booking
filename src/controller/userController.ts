import { Request } from "express";
import { Iuser,ControllerResponse } from "../interface/userInterface";
import { statusCode } from "../helper/statusCode";
import { createUser ,loginUser,getUser} from "../service/userService";
import { sendOTP,verifyOTP} from '../service/otpService';


export const sendOtpController = async (
  req: Request<{},{},{ phoneNo: string }>
): Promise<ControllerResponse> => {
  try {
    const { phoneNo } = req.body;
    await sendOTP(phoneNo);
    return {
      statusCode: statusCode.OK,
      message: "OTP sent successfully",
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: error.message || "Failed to send OTP",
    };
  }
};

export const verifyOtpAndCreateUserController = async (
  req: Request<{}, {}, Iuser>
): Promise<ControllerResponse> => {
  try {
    const { otp, phoneNo, name, email, password, role, able } = req.body;
    if (!otp) {
  throw new Error("OTP is required");
   }
    const verification = await verifyOTP(phoneNo, otp);

    if (verification.status !== "approved") {
      return {
        statusCode: statusCode.BAD_REQUEST,
        message: "Invalid or expired OTP",
      };
    }

    const result = await createUser({ name, email, phoneNo, password, role, able });
    return {
      statusCode: statusCode.CREATED,
      message: "User created successfully",
    };
  } catch (error: any) {
    return {
      statusCode: statusCode.INTERNAL_ERROR,
      message: error.message || "OTP verification failed",
    };
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
