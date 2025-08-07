import { Twilio } from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

export const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

