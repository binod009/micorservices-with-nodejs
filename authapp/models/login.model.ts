import { Model, ModelAttributes, ModelStatic } from "sequelize";
import { sequelize } from "../db";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";

class LoginModelRegistery {
  private static instance: LoginModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  
  public static getInstance(): LoginModelRegistery {
    if (!LoginModelRegistery.instance) {
      return (LoginModelRegistery.instance = new LoginModelRegistery());
    } else {
      return LoginModelRegistery.instance;
    }
  }

  public async initModel(): Promise<void> {
    try {
      const response = await apiRequest<ModelAttributes<Model>>(
        "GET",
        "http://localhost:3009/login-model",
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

export default LoginModelRegistery;
