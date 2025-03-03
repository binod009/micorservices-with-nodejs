import { Express } from "express";
import { Request, Response, NextFunction } from "express";
import { login } from "../db";
import { transformAttributesToSchema } from "../utils/Helpers";

export const getLoginModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = login.getAttributes();
    const parsedSchema = transformAttributesToSchema<LoginSchema>(schema);
    res.status(200).json(parsedSchema);
  } catch (error) {
    console.log(error);
  }
};

 type LoginSchema = {
  [key: string]: {
    type: string; // Type key, e.g., 'STRING', 'INTEGER', etc.
    primaryKey?: boolean;
    autoIncrement?: boolean;
    allowNull?: boolean;
    defaultValue?: any;
    fieldName?: string;
    _modelAttribute?: boolean;
    field?: string;
    _autoGenerated?: boolean;
  };
};

