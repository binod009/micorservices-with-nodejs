import { sequelize } from "../db";
import { Model, ModelAttributes, ModelStatic } from "sequelize";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiClient";


class customerModelRegistery {
  private static instance: customerModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  
  public static getInstance(): customerModelRegistery {
    if (!customerModelRegistery.instance) {
      return (customerModelRegistery.instance = new customerModelRegistery());
    }
      return customerModelRegistery.instance;
    
  }

  public async initModel(): Promise<void> {
    try {
      const response = await apiRequest<ModelAttributes<Model>>(
        "GET",
        "http://localhost:3009/customer-model",
        undefined,
        undefined,
        {}
      );
      this.models.customers = sequelize.define("customers", response.data);
      await sequelize.sync({force:false,alter: true });
    } catch (error) {
      console.log("customerModel api get error--->",error);
    }
  }

  public getCustomerModel(){
    if (!this.models.customers) {
      throw new ApiError("customer model is not initialized", 500);
    }
    return this.models.customers;
  }
}

export default customerModelRegistery;



