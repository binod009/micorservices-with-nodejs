import { Express } from "express";
import { Request, Response, NextFunction } from "express";
import { customer, sequelize } from "../db";
import { defineAssociations } from "../models/associate.model";

export const getCustomerModel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const schema = customer.getAttributes();
          res.status(200).json(schema );
  } catch (error) {
    console.log(error);
  }
};
