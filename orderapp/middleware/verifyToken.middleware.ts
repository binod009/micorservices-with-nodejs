import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
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
    if (req.headers.authorization || req.headers["x-xsrf-token"]) {
      token =
        typeof req.headers.authorization === "string"
          ? req.headers.authorization
          : null;
    } else if (typeof req.query.token === "string") {
      token = req.query.token;
    } else if (req.cookies.Acs_tkn) {
      token = req.cookies.Acs_tkn as string;
    }
    if (!token) {
      console.log("no token 1st");
      throw new ApiError(401, "token not provided");
    } else {
      const token_split = token.split(" ");
      token = token_split.pop() || "";
      if (!token) {
        console.log("no token");
        throw ApiError.unauthorized("invalid token");
      } else {
        const authuser = jwt.verify(
          token,
          process.env.JWT_SECRET_KEY!
        ) as CustomJwtPayload;
        req.authUser = authuser;
        next();
      }
    }
  }
);
