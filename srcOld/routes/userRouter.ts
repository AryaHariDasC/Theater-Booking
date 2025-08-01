import  express from "express";
import { response } from "../helper/callBack";
import { registerUserController,loginUserController } from "../controller/userController";
import { userC } from "../validators";
import { authMiddleware } from "../middleware/authMiddleware";
const router=express.Router()
router.post('/createUser',userC.useRSchemaChecks,response(registerUserController))
router.post('/loginUser',response(loginUserController))
export default router;