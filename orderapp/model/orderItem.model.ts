import { Model, ModelAttributes, ModelStatic } from "sequelize";
import { sequelize } from "../db";
import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiRequest";

class OrderItemModelRegistery {
  private static instance: OrderItemModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  public static getInstance(): OrderItemModelRegistery {
    if (!OrderItemModelRegistery.instance) {
      return (OrderItemModelRegistery.instance = new OrderItemModelRegistery());
    }
    return OrderItemModelRegistery.instance;
  }

  public async initModel(): Promise<void> {
    if (!this.models.orderitems) {
      try {
        const response = await apiRequest<ModelAttributes<Model>>(
          "GET",
          "http://localhost:3009/orderitem-model"
        );

        this.models.orderitems = sequelize.define(
          "orders_items",
          response.data
        );
        await sequelize.sync({ force: false, alter: true });
      } catch (error) {
        console.log("orderitem model api get error--->", error);
      }
    }
  }

  public getOrderItemModel() {
    if (!this.models.orderitems) {
      throw ApiError.internal("orderItems model not initialzed");
    }
    return this.models.orderitems;
  }
}

export default OrderItemModelRegistery;
