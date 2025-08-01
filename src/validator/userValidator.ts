import { checkSchema } from "express-validator";

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
    phoneNo: {
        isMobilePhone: {
            // options: ['en-IN'],
            errorMessage: 'Valid phone number required',
        },
    },
    
 });

 const userLoginSchema=()=>checkSchema({
    email:{
        isEmail:{
            errorMessage:"Invalid Email"
        }
    },
    password:{
        isLength:{
            options: { min: 6 },
            errorMessage: 'Password must be at least 6 characters long',
        }
        }
    })
 export const userSchemaChecks=(errorFormatter:any)=>({
   useRSchemaChecks:[userSchemaCheck(),errorFormatter]
 })
 export const userLoginSchemaChecks=(errorFormatter:any)=>({
    userLoginSchemas:[userLoginSchema(),errorFormatter]
 })