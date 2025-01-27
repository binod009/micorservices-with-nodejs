import user_svc from "../services/userServices";
import { Request, Response } from "express";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define a custom type for your payload if necessary
interface CustomJwtPayload extends JwtPayload {
  // Add any custom properties that your token contains
  id: string;
  username: string;
}
interface decodeTypes {
  id: string;
}

export const generateAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const reftoken = req.cookies.reftok;
    if (!reftoken) {
      throw new ApiError("refreshToken is not provided", 401);
    }
    let payload;
    try {
      payload = jwt.verify(
        reftoken,
        process.env.REFRESH_SECRET_KEY!
      ) as CustomJwtPayload;
    } catch (err: any) {
      if (err.message === "jwt expired") {
        throw new ApiError("refreshToken expired, please login again", 401);
      }
    }
    const newAccessToken = jwt.sign(
      { id: payload?.id, exp: payload?.exp },
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
      const decode = jwt.verify(
        token,
        process.env.EMAIL_VERIFICATION_KEY!
      ) as decodeTypes;
      await user_svc.updateUser("login", ["active", decode["id"]]);
      res.status(200).json({
        msg: "Account Activated successfully",
      });
    }
  }
);
