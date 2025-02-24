import bcrypt, { compareSync } from "bcryptjs";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import pool from "../db";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import sendEmailVerification from "../services/emailServices";
require("dotenv").config();
import user_svc from "../services/userServices";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  // Insert user into the database
  const user = await user_svc.signUpUser({ username: username, email: email, password: hashedPassword });

  const token = jwt.sign(
    { id: user.result.id},
    process.env.EMAIL_VERIFICATION_KEY!,
    { expiresIn: "1h" }
  );
  // after successfull creating sending  user activation link to gmail;
  await sendEmailVerification(email, token);
  res.status(201).json(user);
});



export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await Login.findOne({ where: { email: email } });
 
  if (user && user.dataValues.status === "inactive") {
    throw new ApiError("Check you email to Activate your account", 400);
  }
  if (user  && user.dataValues.status === "active") {
    const comparePassword = bcrypt.compareSync(password, user.dataValues.password);
    if (comparePassword) {
      const payload = { id: user.dataValues.id, username: user.dataValues.username };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1h",
      });

      //refreshtoken for generating new accesstoken after accessToken expires
      const refreshToken = jwt.sign(
        { id: user.dataValues.id, username:user.dataValues.username },
        process.env.REFRESH_SECRET_KEY!,
        { expiresIn: "7d" }
      );
      res.cookie("reftok", refreshToken, { httpOnly: true,secure:false });
      res.cookie("Acs_tkn", accessToken, {
        httpOnly: true,
        secure: false,  // Use HTTPS
      });
      res.status(200).json({
        success: true,
      });
      // enable below to send both token in response 
  
      // res.status(200).json({
      //   msg: "success",
      //   accessToken: accessToken,
      //   refreshToken: refreshToken,
      // });
    }
  } else {
    throw new ApiError("Email address didnot matched", 400);
  }
});
