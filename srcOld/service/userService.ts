import { IUser } from '../interface/userInterface';
import { UserModel } from '../model/userModel/userModel';
import { fetchDetailsByEmailOfUser, hashPassword, comparePassword } from '../helper/commonHelper';
import jwt from 'jsonwebtoken';
export const registerUser = async (userData: IUser) => {
    const { name, email, password,phone,role } = userData;
    const emailExists = await fetchDetailsByEmailOfUser(email);
    if (emailExists) {
        throw new Error('Email already registered');
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,phone,role
    });

    await newUser.save();
    return { message: 'User registered successfully' };
};

export const loginUser = async (userData:IUser) => {
    const { email, password } = userData;
    const user = await fetchDetailsByEmailOfUser(email);
    console.log(user)
    if (!user) {
        throw new Error("User doesn't find")
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return { message: "Invalid email or password" };
    }
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET as string, {
        expiresIn: '1h',
    }
   
    );
    if (!token) {
        throw new Error('Token generation failed')
    }
 console.log(token)
    return {
        message: 'User logged in successfully',
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            phone:user.phone,
            role:user.role
        }
    };

}