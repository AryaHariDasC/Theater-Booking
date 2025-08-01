import express from "express";
import { createUserController,loginUserController,getProfileUserController } from "../controller/userController";
import { createUv,loginUv } from "../validator";
import { authMiddleware } from "../middleware/authMiddleware";
import { response} from '../helper/callback'

const router=express.Router();

router.post('/createUser',createUv.useRSchemaChecks,response(createUserController));

router.post('/loginUser',loginUv.userLoginSchemas,response(loginUserController));

router.get('/getUser',authMiddleware,response(getProfileUserController))

export default router;