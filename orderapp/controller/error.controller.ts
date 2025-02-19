import { NextFunction, Response, Request } from "express";
import ApiError from "../utils/ApiError";
import { JsonWebTokenError } from "jsonwebtoken";
import { stat } from "fs";

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
  
  if (error instanceof JsonWebTokenError) {
    res.status(401).json({
      statusCode: 401,
      status: 'fai;',
      msg: error.message
    })
  }
  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      status: error.status,
      message: error.message,
    });
  }
  // if error is not instace of Apierror class
  res.status(500).json({
    statusCode: 500,
    status: "error",
    message: "Internal server error", // Or log the error for debugging
  });
};

// const ErrorHandler = (
//   error: Error | ApiError,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (error.message === "jwt expired") {
//     res.status(401).json({
//       statusCode: 401,
//       status: "fail",
//       message: "token expired",
//     });
//   }
//   if (error instanceof ApiError) {
//     res.status(error.statusCode).json({
//       statusCode: error.statusCode,
//       status: error.status,
//       message: error.message,
//     });
//   }
//   res.status(500).json({
//     statusCode: 500,
//     status: "error",
//     message: "Internal Server Error",
//   });
// };

export default ErrorHandler;
