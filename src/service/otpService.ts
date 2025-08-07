import { twilioClient, verifyServiceSid } from '../config/twilio';

export const sendOTP = async (phone: string) => {
  return twilioClient.verify.v2.services(verifyServiceSid)
    .verifications
    .create({ to: phone, channel: 'sms' });
};

export const verifyOTP = async (phone: string, code: string) => {
  return twilioClient.verify.v2.services(verifyServiceSid)
    .verificationChecks
    .create({ to: phone, code });
};
