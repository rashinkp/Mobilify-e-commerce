// utils/mailSender.js
import nodemailer from "nodemailer";

const mailSender = async (email, title, body) => {

  console.log(email,title,body)
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "mobilify45@gmail.com",
        pass: "funq qwiv wemo axyn",
      },
    });
    // Send emails to users
    let info = await transporter.sendMail({
      from: "www.sandeepdev.me - Sandeep Singh",
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error) {
    console.log(error.message);
  }
};


export default mailSender;
