import UserService from "../services/userServices";
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import ConnectRedis from "../utils/redisClient";
const user_svc = new UserService();
// Define a custom type for your payload if necessary
interface CustomJwtPayload extends JwtPayload {
  // Add any custom properties that your token contains
  id: string;
  username: string;
}

interface decodeTypes {
  id: number;
}

export const generateAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let payload;
    if (!req.cookies.reftok) {
      throw new ApiError("refresh token not provided", 401);
    }
    const reftoken = req.cookies.reftok;
    try {
      payload = jwt.verify(
        reftoken,
        process.env.REFRESH_SECRET_KEY!
      ) as CustomJwtPayload;
      
    } catch (err: any) {
      if (err.message === "jwt expired") {
        throw new ApiError("refreshtoken expired please login", 401);
      }
    }
    const newAccessToken = jwt.sign(
      { id: payload?.id, username: payload?.username },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: "1h" }
    );
    res.cookie("reftok", reftoken, { httpOnly: true });
    res.status(200).json({
      msg: "success",
      accessToken: newAccessToken,
      refreshToken: reftoken,
    });
  }
);

// controller for verifying user with email
export const activeRegisterUser = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.query.token as string;
    if (!token) {
      throw new ApiError("token not provided", 401);
    } else {
      const redis = ConnectRedis.getInstance();
      const redisRes = await redis.verifyCurrentUser(token);
      if (!redisRes?.id) {
        throw new ApiError("Invalid user data", 404);
      }
      // const decode = jwt.verify(
      //   token,
      //   process.env.EMAIL_VERIFICATION_KEY!
      // ) as decodeTypes;
      await user_svc.updateUser("active",parseInt(redisRes?.id));
      res.status(200).json({
        msg: "Account Activated successfully",
      });
    }
  }
);

