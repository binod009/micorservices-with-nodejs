import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { JsonWebTokenError } from "jsonwebtoken";

const ErrorHandler = (
  error: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.message === "jwt expired") {
    res.status(401).json({
      statusCode: 401,
      status: "fail",
      message: "token expired",
    });
  }

  if (error instanceof ApiError) {
    if (error.code === "23505") {
      duplicateErrorHandler(error);
    }
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      status: error.status,
      message: error.message,
    });
  }
};

const duplicateErrorHandler = (error: Error | ApiError) => {
  if (error instanceof ApiError) {
    const regex = /Key \(email\)=/; // Regular expression
    const cleanedMessage = error.detail.replace(regex, "");
    error.status = "fail";
    error.statusCode = 400;
    error.message = cleanedMessage;
  }
};

export default ErrorHandler;
