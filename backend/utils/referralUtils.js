import crypto from "crypto";

export const generateReferralCode = (userId) => {
  const prefix = "USR";
  const userIdPart = userId.slice(0, 4).toUpperCase(); 
  const randomString = crypto.randomBytes(2).toString("hex").toUpperCase(); 
  return `${prefix}-${userIdPart}-${randomString}`;
};
