import { stat } from "fs";

class ApiError extends Error {
  public statusCode: number;
  public status: string;
  isOperational: boolean;
  // this is for dynamic property that can be added to apiError class
  [key: string]: any;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
      this.status = statusCode >= 200 && statusCode < 300 ? "success" : statusCode >= 400 && statusCode < 500 ? "fail" : "error";
      this.isOperational = false;
    Error.captureStackTrace(this, this.constructor);
  }
  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message: string): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  static internal(message: string): ApiError {
    return new ApiError(500, message);
  }
}

export default ApiError;
