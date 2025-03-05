import { NextFunction, Response, Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import ApiError from "../utils/ApiError";

const ErrorHandler = (
  error: Error | ApiError,  // Ensure it's typed correctly
  req: Request,
  res: Response,
  next: NextFunction
)=> {  // Return type should be void, not 0 | undefined
  
  if (error instanceof TokenExpiredError) {
    res.status(401).json({
      success: false,
      error: "TokenExpiredError",
      message: "Your session has expired. Please log in again.",
      expiredAt: error.expiredAt,
    });
  } else

    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: "JsonWebTokenError",
        message: error.message,
      });
    } else
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          success: false,
          statusCode: error.statusCode,
          status: error.status,
          message: error.message,
        });
      }
      else {
        // Default error handler for unhandled errors
        res.status(500).json({
          success: false,
          statusCode: 500,
          status: "error",
          message: "Internal server error",
        });
      }
};

export default ErrorHandler;