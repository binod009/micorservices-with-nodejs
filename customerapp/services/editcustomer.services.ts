import { Model, ModelStatic } from "sequelize";
import Wishlist from "../models/wishlists.model";
import { apiRequest } from "../utils/apiClient";
import { create } from "domain";

import ApiError from "../utils/ApiError";
import customerModelRegistery from "../models/customers.model";
import WishListModelRegistery from "../models/wishlists.model";
import { sequelize } from "../db";

interface Idata {
  id: number;
  user_id: number;
  phone: number;
  address: string;
  status: string;
}

type customerTypes = {
  user_id: number;
  phone: string;
  address: string;
  status: string;
};

type wishlistDataTypes = {
  customer_id: number;
  product_id: number;
};

interface Ipayload {
  event: {};
  data: {};
}

class EditCustomerServices {
  private modelRegistry: customerModelRegistery;
  private wishmodelRegistry: WishListModelRegistery;
  public customerModel: ModelStatic<Model<any, any>> | null = null;
  public wishlistModel: ModelStatic<Model<any, any>> | null = null;

  constructor() {
    this.modelRegistry = customerModelRegistery.getInstance();
    this.wishmodelRegistry = WishListModelRegistery.getInstance();
    this.initialize();
  }
  // find user based on email
  // getUserByEmail = async (email: string) => {
  //   const result = await this.pool.query(
  //     "SELECT * FROM login WHERE email = $1",
  //     [email]
  //   );
  //   return result;
  // };

  private async initialize() {
    // Initialize the model if it's not already initialized
    if (!this.wishlistModel) {
      await this.modelRegistry.initModel();
      await this.wishmodelRegistry.initModel(); // Wait for the model to initialize
      this.customerModel = this.modelRegistry.getCustomerModel(); // Now assign the model
      this.wishlistModel = this.wishmodelRegistry.getWishlistModel();
    }
  }

  async getCustomerModel() {
    const customer_model = await apiRequest(
      "GET",
      "http://localhost:3009/customer-model",
      undefined,
      undefined,
      {}
    );
    await sequelize.sync({ force: false, alter: true });
    return customer_model;
  }

  async createCustomer(data: customerTypes) {
    try {
      if (!this.customerModel) throw new ApiError("model not initialized", 500);
      const createuser = await this.customerModel.create(data);
      const result = await createuser.save();
      return { status: 201, msg: "success", result: result };
    } catch (error) {
      console.log("error from operation databse", error);
    }
    return { status: 500, msg: "error creating cusomter" };
  }

  async addWhishList(data: wishlistDataTypes) {
    try {
      const result = await this.wishlistModel?.create(data);
      return {status:200,msg:"success",result:result?.dataValues}
    } catch (error) {
      console.log("this is error", error);
    }
    return {status:404,msg:"error creating wishlist"}
  }

  async deleteWishList(id: string) {
    const result = await this.wishlistModel?.destroy({
      where: {
        id: id,
      },
    });
    return result; // This will return the deleted row (if any) after the delete operation
  }

  async getWishList(customerid: string) {
    //     const query = `
    //        SELECT
    //     w.id AS wishlist_id,
    //     w.customer_id,
    //     p.id AS product_id,
    //     p.name AS product_name,
    //     p.description,
    //     p.price,
    //     w.added_at
    // FROM wishlists w
    // JOIN products p ON w.product_id = p.id
    // WHERE w.customer_id = 1;
    //     `;
    const result = await this.wishlistModel?.findOne({
      where: { id: customerid },
      raw: true,
    });
    console.log("this is result", result);
  }

  // update customer data
  async updateCustomer(data: Idata) {
    // const query = `
    //     UPDATE login
    //     SET email = $1, password = $2, username = $3
    //     WHERE id = $4 RETURNING *
    //   `;
    if (!this.customerModel)
      throw new ApiError("customer model not initialized", 500);
    const [updatedCount, updatedRows] = await this.customerModel.update(
      { phone: data.phone, address: data.address, status: data.status },
      { where: { id: +data.id }, returning: true }
    );
    if (updatedCount > 0) {
      return {
        status: 200,
        msg: "updated successfully",
        result: updatedRows[0].dataValues,
      };
    }
    return { status: 404, msg: "data not found to update" };
  }

  async findById(userId: string) {
    const user = await apiRequest(
      "GET",
      `http://localhost:3007/auth/api-events/user/ ${userId}`,
      undefined,
      undefined
    );
    console.log(user);
  }

  async ManageProduct() {}

  async SubscribeEvents(payload: Ipayload) {
    const { event, data } = payload;
    switch (event) {
      case "GET PRODUCT":
        this.ManageProduct();
        break;
    }
  }
}

export default EditCustomerServices;
