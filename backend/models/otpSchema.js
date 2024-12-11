// models/otpModel.js
import mongoose from"mongoose";
import mailSender from "../utils/mailSender.js";
import User from "./userSchema.js";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});
// Define a function to send emails
async function sendVerificationEmail(email, otp) {

  console.log(email , otp)
  
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}
otpSchema.pre("save", async function (next) {
  console.log("New document saved to the database");

  // Only send an email when a new document is created
  if (this.isNew) {
    try {
      // Fetch the user using the userId stored in OTP
      const user = await User.findById(this.userId);
      if (user) {
        const email = user.email;
        await sendVerificationEmail(email, this.otp);
      } else {
        console.log("User not found, cannot send OTP email");
      }
    } catch (error) {
      console.log("Error occurred while fetching user email: ", error);
      throw error;
    }
  }
  next();
});

export const OTP = mongoose.model("OTP", otpSchema);
