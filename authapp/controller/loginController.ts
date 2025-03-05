import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import sendEmailVerification from "../services/emailServices";
require("dotenv").config();
import UserService from "../services/userServices";
import { access } from "fs";

class LoginController {
  private userService: UserService;
  constructor() {
    // Initialize the UserService instance
    this.userService = new UserService();
  }

  // SignUp Method
  signUp = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Insert user into the database
    const user = await this.userService.signUpUser({
      username: username,
      email: email,
      password: hashedPassword,
    });
    console.log("user created0-0-0-0>-", user);
    const token = jwt.sign(
      { id: user?.result.id },
      process.env.EMAIL_VERIFICATION_KEY!,
      { expiresIn: "1h" }
    );
    console.log(token);
    res.status(201).json(user);
    // Optionally, send the email verification link
    // await sendEmailVerification(email, token);
  });

  // SignIn Method
  signIn = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!this.userService.loginModel)
      throw new ApiError("Model Not initialized", 500);

    // Get the login model from the registry
    const user = await this.userService.loginModel.findOne({
      where: { email: email },
    });

    // Check if user exists and account status
    if (user && user.dataValues.status === "inactive") {
      throw new ApiError("Check your email to activate your account", 400);
    }

    if (user && user.dataValues.status === "active") {
      const comparePassword = bcrypt.compareSync(
        password,
        user.dataValues.password
      );

      if (comparePassword) {
        const payload = {
          id: user.dataValues.id,
          username: user.dataValues.username,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
          expiresIn: "1h",
        });

        // Refresh token for generating new access token after expiry
        const refreshToken = jwt.sign(
          { id: user.dataValues.id, username: user.dataValues.username },
          process.env.REFRESH_SECRET_KEY!,
          { expiresIn: "7d" }
        );

        res.cookie("reftok", refreshToken, { httpOnly: true, secure: false });
        res.cookie("Acs_tkn", accessToken, {
          httpOnly: true,
          secure: false, // Use HTTPS in production
        });

        res.status(200).json({
          success: true,
          accessToken: accessToken,
        });
      } else {
        throw new ApiError("Invalid password", 400);
      }
    } else {
      throw new ApiError("Email address not found", 400);
    }
  });
}

export default LoginController;
