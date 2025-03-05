import { DataTypes, DATE, Model, ModelAttributes, ModelStatic, Sequelize } from "sequelize";
import { sequelize } from "../db";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";



class OrderModelRegistery {
  private static instance: OrderModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  public static getInstance(): OrderModelRegistery {
    if (!OrderModelRegistery.instance) {
      return OrderModelRegistery.instance = new OrderModelRegistery();
    }
      return OrderModelRegistery.instance;
    
  }

  public async initModel(): Promise<void> {
    if (!this.models.orders) {
      try {
        const response = await apiRequest<ModelAttributes<Model>>(
          "GET",
          "http://localhost:3009/order-model"
        );
          response.data.order_date = {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
          }
        this.models.orders = sequelize.define("orders", response.data);
        await sequelize.sync({ force: false, alter: true });
      } catch (error) {
        console.log("Order Model api get error", error);
      }
    }
  }

  public getOrderModel(){
    if (!this.models.orders) {
        throw ApiError.internal("order model not initialzed");
    }
    return this.models.orders;
  }
}

export default OrderModelRegistery;



