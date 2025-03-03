import { sequelize } from "../db";
import { Model, ModelAttributes, ModelStatic } from "sequelize";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";

class productModelRegistery {
  private static instance: productModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  public static getInstance(): productModelRegistery {
    if (!productModelRegistery.instance) {
      return (productModelRegistery.instance = new productModelRegistery());
    } else {
      return productModelRegistery.instance;
    }
  }

  public async initModel(): Promise<void> {
    try {
      const response = await apiRequest<ModelAttributes<Model>>(
        "GET",
        "http://localhost:3009/product-model",
        undefined,
        undefined,
        {}
      );
      this.models.products = sequelize.define("products", response.data);
    } catch (error) {
      console.log("API GET ERROR PRODUTMODEL", error);
    }
  }

  public getProductModel() {
    if (!this.models.products) {
      throw new ApiError("product model is not initialized", 500);
    }
    return this.models.products;
  }
}

export default productModelRegistery;
