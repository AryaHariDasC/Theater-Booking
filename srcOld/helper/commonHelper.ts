import bcrypt from 'bcrypt'
import { theaterModel  } from '../model/theatermodel/theaterModel';
import { Itheater } from '../interface/theaterInterface';
import { Iscreen } from '../interface/screenInterface';
import { screenModel } from '../model/theatermodel/screenModel';
import { movieModel } from '../model/theatermodel/movieModel';
import { IUser } from '../interface/userInterface';
import { UserModel } from '../model/userModel/userModel';

export const fetchDetailsByEmail = async (email: string): Promise<Itheater | null> => {
    return await theaterModel.findOne({ email });

};
export const fetchDetailsByEmailOfUser=async(email:string):Promise<IUser | null>=>{
  return await UserModel.findOne({email})
}
export const hashPassword = async (password: string): Promise<string> => {
    console.log('hai')
    return await bcrypt.hash(password, 11);
};
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};
export const screenNoExist=async(screenNo:number):Promise<Iscreen | any> =>{
    return await screenModel.findOne({screenNo})
}

export const buildSeats = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    Number: i + 1,
    Booked: false
  }));
};

export const isShowTimeAvailable = async (
  screenId: string,
  showTimes: string[]
): Promise<boolean> => {
  const conflict = await movieModel.findOne({
    screenId,
    showTime: { $in: showTimes }
  });

  return !conflict;
};


export const groupSeatsByType = (seats: any[]) => {
  const grouped: { [key: string]: any[] } = {};

  for (const seat of seats) {
    if (!grouped[seat.seatType]) {
      grouped[seat.seatType] = [];
    }
    grouped[seat.seatType].push({
      seatNumber: seat.seatNumber,
      booked: seat.booked,
      price: seat.price
    });
  }

  return grouped;
};
