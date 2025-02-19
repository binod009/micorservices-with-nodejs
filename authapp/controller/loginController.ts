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
  const result = await user_svc.signUpUser([username, email, hashedPassword]);
  console.log(result.rows[0]);
  const token = jwt.sign(
    { id: result.rows[0].id },
    process.env.EMAIL_VERIFICATION_KEY!,
    { expiresIn: "1h" }
  );
  console.log("token", token);
  // after successfull creating sending  user activation link to gmail;
  await sendEmailVerification(email, token);
  res.status(201).json({
    msg: "created successfully",
    result: result.rows[0],
  });
});

export const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await user_svc.getUserByEmail(email);
  if (rows.length > 0 && rows[0].status === "inactive") {
    throw new ApiError("Check you email to Activate your account", 400);
  }
  if (rows.length > 0 && rows[0].status === "active") {
    const comparePassword = bcrypt.compareSync(password, rows[0].password);
    if (comparePassword) {
      const payload = { id: rows[0].id, username: rows[0].username };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
        expiresIn: "1h",
      });

      //refreshtoken for generating new accesstoken after accessToken expires
      const refreshToken = jwt.sign(
        { id: rows[0].id, username: rows[0].username },
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
