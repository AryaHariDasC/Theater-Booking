import { userModel } from "../models/userModel";
import { Iuser } from "../interface/userInterface";
import { fetchUserDetailsByEmail, hashPassword,comparePassword } from "../helper/commonHelper";
import jwt from 'jsonwebtoken'
import { log } from "console";

export const createUser = async (userData: Iuser) => {
    try{
    const { name, email, phoneNo, password, role, able } = userData
    const emailExists = await fetchUserDetailsByEmail(email)
    if (emailExists) {
        throw new Error('Email already exists');
    }
    const hashedPassword = await hashPassword(password)
    const newUser = new userModel({
        name, email, password: hashedPassword, phoneNo, role, able
    })
    await newUser.save()
    return { message: "User created successfully" }}
    catch(error:any){
        throw error
    }
}

export const loginUser = async (userData:Iuser) => {
    try{
    const { email, password } = userData;
    const user = await fetchUserDetailsByEmail(email);
    
    if (!user) {
        throw new Error("User doesn't find")
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return { message: "Invalid email or password" };
    }
    const token = jwt.sign(
        { id:user._id,role:user.role },
        process.env.JWT_SECRET as string, {
        expiresIn: '1d',
    }
   
    
    );
     
    if (!token) {
        throw new Error('Token generation failed')
    }

    return {
        message: 'User logged in successfully',
        token,
        user: {
            email: user.email,
            name: user.name,
            phoneNo:user.phoneNo,
            role:user.role,
            id:user._id
        }
    };}
    catch(error:any){
        throw error
    }

}

export const getUser = async (id: string) => {
    return await userModel.findById(id);
}
