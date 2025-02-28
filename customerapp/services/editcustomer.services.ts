import { Model } from "sequelize";
import Wishlist from "../models/wishlists.model";
import { apiRequest } from "../utils/apiClient";
import { create } from "domain";
import { defineCustomerModel } from "../models/customers.model";

interface Idata {
  id: string;
  username: string;
  password: string;
  email: string;
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
  async getCustomerModel() {
    const customer_model = await apiRequest(
      "GET",
      "http://localhost:3009/customer-model",
      undefined,
      undefined,
      {}
    );

    return customer_model;
  }

  async createCustomer(data: customerTypes) {
    try {
      const schema = await this.getCustomerModel();
      const customer_model = defineCustomerModel(schema.data);
      console.log("this is data sent to data create method-->", data);
      const createuser = await customer_model.create(data);
      const result = await createuser.save();
      console.log("database result------------>", result);
      return createuser.dataValues;
    } catch (error) {
      console.log("error from operation databse", error);
    }
  }

  async addWhishList(data: wishlistDataTypes) {
    try {
      const modelobj = await Wishlist.create(data);
      const result = await modelobj.save();
      console.log(result);
    } catch (error) {
      console.log("this is error", error);
    }
  }

  async deleteWishList(id: string) {
    const result = await Wishlist.destroy({
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
    const result = Wishlist.findOne({ where: { id: customerid }, raw: true });
    console.log("this is result", result);
  }

  // update customer data
  // async updateCustomer(data: Idata) {
  //   await this.findById(data.id);
  //   const query = `
  //       UPDATE login
  //       SET email = $1, password = $2, username = $3
  //       WHERE id = $4 RETURNING *
  //     `;
  //   const values = [data.email, data.password, data.username, data.id];
  //   const updated = await this.pool.query(query, values);
  //   return updated.rows[0];
  // }

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
