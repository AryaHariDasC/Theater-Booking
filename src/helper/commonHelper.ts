import bcrypt from 'bcrypt';
import { userModel } from "../models/userModel";
import { Iuser} from "../interface/userInterface";


export const fetchUserDetailsByEmail=async(email:String):Promise<Iuser| null>=>{
    return await userModel.findOne({email});
}
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 11);
};
export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};



// Helper to convert "2h 30min" → 150
export const parseDurationToMinutes = (duration: string): number => {
  const hourMatch = duration.match(/(\d+)\s*h/);
  const minMatch = duration.match(/(\d+)\s*min/);

  const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
  const minutes = minMatch ? parseInt(minMatch[1]) : 0;

  return hours * 60 + minutes;
};

// Convert "2 pm" → Date object
 export const parseShowTimeToDate = (timeStr: string): Date => {
  const [time, modifier] = timeStr.toLowerCase().split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (!minutes) minutes = 0;

  if (modifier === "pm" && hours < 12) hours += 12;
  if (modifier === "am" && hours === 12) hours = 0;

  const now = new Date();
  now.setHours(hours, minutes, 0, 0);
  return now;
};

