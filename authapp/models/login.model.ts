import { Model, ModelStatic, Sequelize } from "sequelize";
import { sequelize } from "../db";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";

class LoginModelRegistery {
  private static instance: LoginModelRegistery;
  public models: { [key: string]: ModelStatic<any> } = {};

  private constructor() {}

  public static getInstance(): LoginModelRegistery {
    if (!LoginModelRegistery) {
      LoginModelRegistery.instance = new LoginModelRegistery();
    }
    return LoginModelRegistery.instance;
  }
  public async initModel(): Promise<any> {
    try {
      const schema = await apiRequest(
        "GET",
        "http://localhost:3009/customer-model",
        undefined,
        undefined,
        {}
      );
      this.models.login = sequelize.define("login", schema);
    } catch (error) {
      console.log(error);
    }
  }
}

export default LoginModelRegistery;
