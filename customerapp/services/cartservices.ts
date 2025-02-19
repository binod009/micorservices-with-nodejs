import Database from "../db";
import { apiRequest } from "../utils/apiClient";
import axios from "axios";
import ApiError from "../utils/ApiError";
interface Icartdata {
  customer_id: string;
  product_id: string;
  quantity: number;
  price: number;
}
interface StockResponse {
  msg: string; // Response message
  stock: number; // Available stock
}

class cartServices extends Database {
  async addtocartService(cartdata: Icartdata, token: string) {
    const stockres = await apiRequest<StockResponse>(
      "GET",
      `http://localhost:3007/product/api/v1/products/stock/${cartdata.product_id}`,
      token
    );

    if (cartdata.quantity > stockres.data.stock) {
      return {
        status: 400,
        msg: `Not enough in the stock, Available stock ${stockres.data.stock}`,
        stock: stockres.data.stock,
      };
    } else {
      // if some of the value is not accurate req goes on with no error thrown.
      const query = `INSERT INTO cart (customer_id, product_id, quantity, price) VALUES($1,$2,$3,$4) RETURNING *`;
      const values = [
        cartdata.customer_id,
        cartdata.product_id,
        cartdata.quantity,
        cartdata.price,
      ];
      const dbresult = await this.pool.query(query, values);
      console.log(dbresult.rows);
      return {
        status: 201,
        msg: "success",
        result: dbresult.rows[0],
      };
    }
  }
  async getallCartData() {
    const query = `SELECT * FROM cart`;
    const cartdata = await this.pool.query(query);
    if (cartdata.rowCount === 0) {
      throw new ApiError("no cart data", 404);
    } else {
      return { status: 200, msg: "success", result: cartdata.rows };
    }
  }
}

export default new cartServices();
