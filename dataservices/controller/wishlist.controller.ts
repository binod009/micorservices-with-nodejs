import { Request, Response, NextFunction } from "express";

import { transformAttributesToSchema } from "../utils/Helpers";
import { wishlists } from "../db";

export const getWishListModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const schema = wishlists.getAttributes();
      const parsedSchema = transformAttributesToSchema<WishlistSchema>(schema);
    res.status(200).json(parsedSchema);
  } catch (error) {
    console.log(error);
  }
};

type WishlistSchema = {
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
