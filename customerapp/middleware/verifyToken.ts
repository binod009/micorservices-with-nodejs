
import ApiError from "../utils/ApiError";
import dotenv from "dotenv"
dotenv.config();
import { Request,Response,NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Jwt,{ JwtPayload } from "jsonwebtoken";
interface CustomJwtPayload extends JwtPayload {
  user_id: string;
  role: string;
}

interface CustomRequest extends Request {
  authUser?: { user_id: string; role: string }; // Define the shape of `authUser`
}

export const verifyToken = asyncHandler(async (req:CustomRequest, res:Response, next:NextFunction) => {
  let token: string | string[] | null = null;
  if (req.headers.authorization || req.headers["x-xsrf-token"]) {
    token = typeof req.headers.authorization === "string" ? req.headers.authorization : null;
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
      const authuser = Jwt.verify(token, process.env.JWT_SECRET_KEY!) as CustomJwtPayload;
      req.authUser = authuser ;
      next();
    }
  }
});
