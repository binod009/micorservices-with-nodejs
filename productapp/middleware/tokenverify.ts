import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();
import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";

declare module "express-serve-static-core" {
  interface Request {
    authuser: JwtPayload;
  }
}

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

interface CustomRequest extends Request {
  authUser?: { userId: string; role: string }; // Define the shape of `authUser`
}

export const verifyToken = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
   
    let token: string | string[] | null = null;
    if (req.cookies.Acs_tkn) {
      token = req.cookies.Acs_tkn as string;
    }
    if (req.headers.authorization || req.headers["x-xsrf-token"]) {
      token =
        typeof req.headers.authorization === "string"
          ? req.headers.authorization
          : null;
    } else if (typeof req.query.token === "string") {
      token = req.query.token;
    }
    if (!token) {
      throw new ApiError("token not provided", 401);
    } else {
      const token_split = token.split(" ");
      token = token_split.pop() || "";
      if (!token) {
        throw new ApiError("invalid token", 401);
      } else {
        const authuser = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY!
        ) as CustomJwtPayload;
        console.log("from productservice verifytoken", authuser);
        req.authUser = authuser;
        next();
      }
    }
  }
);

const refreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.reftok;
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!);
  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
});

export default verifyToken;
