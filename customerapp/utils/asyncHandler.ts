import { NextFunction,Request,Response } from "express";
import { RequestHandler } from "express-serve-static-core";

export const asyncHandler = (fn:RequestHandler) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
}