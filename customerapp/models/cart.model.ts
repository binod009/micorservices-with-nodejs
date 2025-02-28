import { sequelize } from "../db";
import { Model, ModelAttributes, ModelStatic } from "sequelize";

import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiClient";
class CartModelRegistery {
  private static instance: CartModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  public static getInstance(): CartModelRegistery {
    if (!CartModelRegistery.instance) {
      return (CartModelRegistery.instance = new CartModelRegistery());
    } else {
      return CartModelRegistery.instance;
    }
  }

  public async initModel(): Promise<void> {
    try {
      const response = await apiRequest<ModelAttributes<Model>>(
        "GET",
        "http://localhost:3009/cart-model",
        undefined,
        undefined,
        {}
      );
    
      this.models.cart = sequelize.define("carts", response.data);
      await sequelize.sync({ force:true,alter: true });
    } catch (error) {
      
    }
  }

  public getCartModel(){
    if (!this.models.cart) {
      throw new ApiError("cart model is not initialized", 500);
    }
    return this.models.cart;
  }
}

export default CartModelRegistery;

//  const Cart = sequelize.define(
//   "carts",
//   {
//     cart_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     customer_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     product_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     quantity: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     price: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );


