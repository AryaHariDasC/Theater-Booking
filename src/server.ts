import express from 'express'
import connectDB from './config/db'
import userRouter from "./routes/userRouter"
import adminRouter from './routes/adminRouter'
import clientRouter from "./routes/clientRouter"
// import dotenv from 'dotenv'
// dotenv.config();
const app = express();
connectDB();
app.use(express.json());
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use("/client", clientRouter)

//handle not found routes with a proper response
const PORT = 8001;
app.listen(PORT, () => {
   console.log(`server is running on the port ${PORT}`);
})