require("dotenv").config();
const nodemailerConfig = {
  host: "smtp.gmail.com",
  port: 587, // Port for STARTTLS
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
};

module.exports = nodemailerConfig;
