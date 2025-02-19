import Database from "../db";

import jwt from "jsonwebtoken";
import { HelperparseFilter } from "../helpers/parsedFilters";

interface IData {
  name: string;
  price: number;
  description: string;
  user_id: string;
  category: string;
  brand: string;
  slug: string;
}

// since user can query based on price or category so i have used dynamce key value
//# price:500 | electronices
type Ifilters = {
  category?: string;
  brand?: string;
  id?: number;
  slug?: string;
  price?: number | { min: number; max: number };
};

type updateProductTypes = {
  status: number,
  msg: string,
  result?:[{}]
}

class ProductServices extends Database {
  async createProduct(data: IData) {
    const query =
      "INSERT INTO products (name,price,description,category,user_id) VALUES ($1, $2,$3,$4,$5) RETURNING *";
    const result = await this.pool.query(query, [
      data.name,
      data.price,
      data.description,
      data.category,
      data.brand,
      data.user_id,
      data.slug,
    ]);
    return result;
  }

  async getProduct(filters: Ifilters) {
    const filterConditions: { [key: string]: string } = {
      category: "CATEGORY",
      brand: "BRAND",
      price: "'PRICE",
      slug: "SLUG",
      ID: "ID",
    };

    let query = `SELECT * FROM products where 1=1`;
    let values = [];
    let index = 1;

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (
          key === "price" &&
          typeof value !== "string" &&
          typeof value !== "number"
        ) {
          query += ` AND price BETWEEN $${index++} AND $${index++}`;
          values.push(value.min, value.max);
        } else if (key === "price" && typeof value === "number") {
          query += ` AND price = $${index++}`;
          values.push(value);
        } else if (filterConditions[key]) {
          query += ` AND ${filterConditions[key]}=$${index++}`;
          values.push(value);
        }
      }
    }

    const res = await this.pool.query(query, values);
    return res.rows.length > 0 ? res.rows : res.rows[0];
  }

  async checkProductStock(ProductId: string) {
    const query = `SELECT * FROM product_quantity WHERE product_id= $1`;
    const result = await this.pool.query(query, [ProductId]);

    if (result.rows.length > 0) {
      const stock = result.rows[0].stock_quantity;
      return stock;
    } else {
      return false;
    }
  }



  async updateProductStockService(
    product_id: string,
    qty: number,
    operation: "REDUCE" | "RESTORE"
  ):Promise<updateProductTypes>{
    let query;
    let values = [qty, product_id];
    if (operation === "REDUCE") {
      query = `UPDATE product_quantity
    SET stock_quantity = stock_quantity - $1
    WHERE product_id = $2 
      AND stock_quantity >= $1
    RETURNING stock_quantity`;
    } else if (operation === "RESTORE") {
      query = `UPDATE product_quantity
    SET stock_quantity = stock_quantity + $1
    WHERE product_id = $2
    RETURNING stock_quantity`;
    } else {
      return { status: 400, msg: "Invalid Operation type" };
    }

    const result = await this.pool.query(query, values);
    if (result.rowCount === 0) {
      return {
        status: 409,
        msg: "Stock is insufficient or product does not exist",
      };
    } else {
      return {
        status: 200,
        msg:
          operation === "REDUCE"
            ? "stock updated successfully"
            : "stock restore successfully",
        result: result.rows[0],
      };
    }
  }

  async SubscribeEvents(payload: any): Promise<updateProductTypes> {
    const { event, data } = payload;
    const { product_id, qty, operation } = data;
    let result;
    switch (event) {
      case "ORDER CREATED":
        result = await this.updateProductStockService(
          product_id,
          qty,
          operation
        );
        break;
      
      case "ORDER CANCELED":
        result = await this.updateProductStockService(
          product_id,
          qty,
          operation
        );
        break;
    }
    return result as updateProductTypes;
  }
}

export default ProductServices;
