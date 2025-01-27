import { Request, Response, NextFunction, RequestHandler } from "express";

 const asyncHandler = (fn: RequestHandler): RequestHandler => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch((err: Error) => next(err));
};
export default asyncHandler;