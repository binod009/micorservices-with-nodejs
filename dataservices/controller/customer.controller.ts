import { Request, Response, NextFunction } from "express";
import { customer } from "../db";
const SAFE_FIELDS = ["name", "email", "createdAt"];
export const getCustomerModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = customer.getAttributes();
    console.log('this is customer schema', schema);
    res.status(200).json(schema);
  } catch (error) {
    console.log(error);
  }
};
