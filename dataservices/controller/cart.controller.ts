
import { Request, Response, NextFunction } from "express";
import { cart} from "../db";
import { transformAttributesToSchema } from "../utils/Helpers";

export const getCartModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const schema = cart.getAttributes();
    // attributes are not sent from api response som,converting the type:Object to type:'STRING','INTEGER'..
    const parsedSchema = transformAttributesToSchema<cartSchema>(schema);
    res.status(200).json(parsedSchema);
  } catch (error) {
    console.log(error);
  }
};
type cartSchema = {
    [key: string]: {
        type: string; // Example: 'STRING', 'INTEGER'
        primaryKey?: boolean;
        autoIncrement?: boolean;
        allowNull?: boolean;
        defaultValue?: any;
        fieldName?: string;
        _modelAttribute?: boolean;
        field?: string;
        _autoGenerated?: boolean;
        references?: { model: string; key: string }; // For foreign keys
      };
};
