import express from "express";
import {
  sendOtpController,
  verifyOtpAndCreateUserController,
  loginUserController,
  getProfileUserController
} from "../controller/userController";
import { createUv,loginUv } from "../validator";
import { authMiddleware } from "../middleware/authMiddleware";
import { response} from '../helper/callback'

const router=express.Router();

router.post("/send-otp",response(sendOtpController));


router.post("/verify-otp", createUv.useRSchemaChecks, response(verifyOtpAndCreateUserController));


router.post('/loginUser',loginUv.userLoginSchemas,response(loginUserController));

router.get('/getUser',authMiddleware,response(getProfileUserController))

export default router;