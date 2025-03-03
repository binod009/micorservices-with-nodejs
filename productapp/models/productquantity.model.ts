import { sequelize } from "../db";
import { Model, ModelAttributes, ModelStatic } from "sequelize";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";

class productQtyModelRegistery {
  private static instance: productQtyModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  public static getInstance(): productQtyModelRegistery {
    if (!productQtyModelRegistery.instance) {
      return (productQtyModelRegistery.instance =
        new productQtyModelRegistery());
    } else {
      return productQtyModelRegistery.instance;
    }
  }

  public async initModel(): Promise<void> {
    try {
      const response = await apiRequest<ModelAttributes<Model>>(
        "GET",
        "http://localhost:3009/productquantity-model",
        undefined,
        undefined,
        {}
      );
      this.models.productqty = sequelize.define(
        "product_quantities",
        response.data
      );
      await sequelize.sync({force:false, alter: true });
    } catch (error) {
      console.log("api get productquantity error--->", error);
    }
  }

  public getProductQtyModel() {
    if (!this.models.productqty) {
      throw new ApiError("product quantity model is not initialized", 500);
    }
    return this.models.productqty;
  }
}

export default productQtyModelRegistery;

export const defineCustomerModel = (schema: any) => {
  const customer_model = sequelize.define("customers", schema);
  return customer_model;
};
