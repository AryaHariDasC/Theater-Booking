import express from 'express'
import connectDB from './config/db'
import theaterRouter from './routes/theaterRouter'
import userRouter from './routes/userRouter'



import dotenv from 'dotenv'
// dotenv.config();
 const app=express();
  connectDB();
  app.use(express.json());
  app.use('/theaterBook',theaterRouter)
  app.use('/theaterBook',userRouter)
 const PORT=5001;
 app.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`);
 })