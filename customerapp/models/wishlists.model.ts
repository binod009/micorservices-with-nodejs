import { sequelize } from "../db";
import { Model, ModelAttributes, ModelStatic } from "sequelize";

import ApiError from "../utils/ApiError";
import { apiRequest } from "../utils/apiClient";

class WishListModelRegistery {
  private static instance: WishListModelRegistery;
  public models: { [key: string]: ModelStatic<Model<any, any>> } = {};
  private constructor() {}

  public static getInstance(): WishListModelRegistery {
    console.log('am inside getinstance of wishlistModelRegistery');
    if (!WishListModelRegistery.instance) {
      WishListModelRegistery.instance = new WishListModelRegistery()
    }
      return WishListModelRegistery.instance;
  }

  public async initModel(): Promise<void> {
    console.log("am wishlist initmodel");
    try {
      const response = await apiRequest<ModelAttributes<Model>>(
        "GET",
        "http://localhost:3009/wish-model",
        undefined,
        undefined,
        {}
      );
    
      this.models.wishlist = sequelize.define("wishlists", response.data);
      await sequelize.sync({ force: false, alter: true });
    } catch (error) {}
  }

  public getWishlistModel() {
    if (!this.models.wishlist) {
      throw new ApiError("wishlists model instace not found!", 500);
    }
    return this.models.wishlist;
  }
}

export default WishListModelRegistery;
