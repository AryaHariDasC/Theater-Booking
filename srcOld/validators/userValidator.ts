import { checkSchema } from "express-validator";
import { UserModel } from "../model/userModel/userModel";
 const userSchemaCheck=()=>checkSchema({
    name:{
        notEmpty:{
        errorMessage:"Name is required"
        }
    },
    email:{
     isEmail:{
      errorMessage:"Require valid email"
     }
    },
    password: {
        isLength: {
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        }
    },
    phone: {
        isMobilePhone: {
            options: ['en-IN'],
            errorMessage: 'Valid phone number required',
        },
    },
    role:{
        notEmpty:{
         errorMessage:"User Type is required"
        }
    }
 });
 export const userSchemaChecks=(errorFormatter:any)=>({
   useRSchemaChecks:[userSchemaCheck(),errorFormatter]
 })