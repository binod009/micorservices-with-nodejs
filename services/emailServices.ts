import nodemailer from "nodemailer";
import nodemailerConfig from "../utils/config";
import jwt from "jsonwebtoken";
require("dotenv").config();
const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmailVerification = async (to:string, token:string):Promise<void> => {
  const activationUrl = `${process.env.EMAIL_VERIFICATION_URL}?token=${token}`;
  const emailOptions = {
    from: process.env.USER,
    to,
    subject: "Account Activation",
    html: `
   <html>
        <body>
          <h1>Welcome to Our Service!</h1>
          <p>Thank you for registering. Please click the link below to activate your account:</p>
          <p><a href="${activationUrl}" style="color: #4CAF50; font-size: 18px; font-weight: bold;">Activate Account</a></p>
          <p>If you did not register, please ignore this email.</p>
        </body>
      </html>
  `,
  };
  try {
    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.log("failed to send email", error);
    throw error;
  }
};

export default sendEmailVerification;
