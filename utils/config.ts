require("dotenv").config();

type nodemailerConfigTypes = {
  host: string,
  port: number,
  secure: boolean,
  auth: {
    user: string|undefined,
    pass:string|undefined
  }
}
const nodemailerConfig:nodemailerConfigTypes = {
  host: "smtp.gmail.com",
  port: 587, // Port for STARTTLS
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
};
export default nodemailerConfig;
