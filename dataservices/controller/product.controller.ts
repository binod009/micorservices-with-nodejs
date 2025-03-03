import { Request, Response, NextFunction } from "express";
import { transformAttributesToSchema } from "../utils/Helpers";
import { product_quantities } from "../models/productQuantity.model";
import { product, productquantity } from "../db";

export const getProductModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = product.getAttributes();
    const parsedSchema =
          transformAttributesToSchema<productQuantitySchema>(schema);
      res.status(200).json(parsedSchema);
  } catch (error) {
    console.log(error);
  }
};

type productQuantitySchema = {
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
    references?: { model: string; key: string };
  };
};
