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
    } else {
      return customerModelRegistery.instance;
    }
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
      this.models.login = sequelize.define("logins", response.data);
      console.log('here is model assigned',this.models);
      await sequelize.sync({ alter: true });
    } catch (error) {
      console.log("api get error--->", error);
    }
  }

  public getLoginModel(){
    if (!this.models.login) {
      throw new ApiError("login model is not initialized", 500);
    }
    return this.models.login;
  }
}

export default customerModelRegistery;

export const defineCustomerModel = (schema:any) => {
    const customer_model = sequelize.define("customers", schema);
    return customer_model;
}


