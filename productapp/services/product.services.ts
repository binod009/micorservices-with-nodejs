import jwt from "jsonwebtoken";
import { HelperparseFilter } from "../helpers/parsedFilters";
import productModel from "../models/product.model";
import { Model, ModelStatic, Op } from "sequelize";
import ApiError from "../utils/ApiError";
import productQtyModel from "../models/productquantity.model";
import { sequelize } from "../db";
import productModelRegistery from "../models/product.model";
import productQtyModelRegistery from "../models/productquantity.model";

type productDataTypes = {
  name: string;
  price: number;
  description: string;
  user_id: string;
  category: string;
  brand: string;
  slug: string;
};

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
  status: number;
  msg: string;
  result?: [{}];
};

class ProductServices {
  private modelRegistry: productModelRegistery;
  private productQtyModelRegistry: productQtyModelRegistery;

  public productModel: ModelStatic<Model<any, any>> | null = null;

  public productQtyModel: ModelStatic<Model<any, any>> | null = null;

  constructor() {
    this.modelRegistry = productModelRegistery.getInstance();
    this.productQtyModelRegistry = productQtyModelRegistery.getInstance();
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
    if (!this.productModel || !this.productQtyModel) {
     
      await this.modelRegistry.initModel();
      await this.productQtyModelRegistry.initModel(); // Wait for the model to initialize
      this.productModel = this.modelRegistry.getProductModel(); // Now assign the model
      this.productQtyModel = this.productQtyModelRegistry.getProductQtyModel();
    }
  }

  async createProduct(data: productDataTypes) {
    console.log("this is data-0-0->", data);
    if (!this.productModel) throw new ApiError("model not initialized", 500);
    const result = await this.productModel.create(data);
    return result;
  }

  async deleteProduct(productId: string) {
    if (!this.productModel) throw new ApiError("model not initialized", 500);
    const result = await this.productModel.destroy({
      where: { id: productId }
    });
    return result ? {status:200,msg:"delete successfully"}:{status:404,msg:"product not found"};
  }


  async FindById(productId: string) {
    if (!this.productModel) throw new ApiError("model not initialized", 500);
    const productdata = await this.productModel.findOne({
      where: { id: productId },
    });
    if (!productdata) {
      throw new ApiError(`Product with Id ${productId} not Found`, 404);
    }
    return { status: 200, msg: "success", result: productdata?.dataValues };
  }

  async getProduct(filters: Ifilters) {
    const filterConditions: { [key: string]: string } = {
      category: "category",
      brand: "brand",
      price: "price",
      slug: "slug",
      ID: "id",
    };
    let condition;
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        if (
          key === "price" &&
          typeof value !== "string" &&
          typeof value !== "number"
        ) {
          condition = {
            price: {
              [Op.between]: [value.min, value.max],
            },
          };
        } else if (key === "price" && typeof value === "number") {
          condition = {
            price: value,
          };
        } else if (filterConditions[key]) {
          condition = {
            [filterConditions[key]]: value,
          };
        }
      }
    }
    if (!this.productModel) throw new ApiError("model not initialized", 500);
    const productResult = await this.productModel.findAll({
      where: condition,
      raw: true,
    });
    return productResult;
  }

  async checkProductStock(ProductId: string) {
    if (!this.productQtyModel)
      throw new ApiError("product quantity model not initialized", 500);
    const result = await this.productQtyModel.findOne({
      where: { product_id: ProductId },
    });
    console.log("this is productResult", result);

    if (result === null) {
      throw new ApiError("product quantity not found", 404);
    }
    if (result?.dataValues) {
      const stock = result.dataValues.stock_quantity;
      return stock;
    } else {
      return false;
    }
  }

  async updateProductStockService(
    product_id: string,
    qty: number,
    operation: "REDUCE" | "RESTORE"
  ): Promise<updateProductTypes> {
    let whereCondition;
    let updateData;
    if (operation === "REDUCE") {
      updateData = {
        stock_quantity: sequelize.literal(`stock_quantity - ${qty}`),
      };
      whereCondition = {
        product_id: product_id,
        stock_quantity: { [Op.gte]: qty },
      };
    } else if (operation === "RESTORE") {
      updateData = {
        stock_quantity: sequelize.literal(`stock_quantity + ${qty}`),
      };
    } else {
      return { status: 400, msg: "Invalid Operation type" };
    }

    if (!this.productQtyModel)
      throw new ApiError("product quantity model not initialized", 500);
    const [updatedRows, [updatedProduct]] = await this.productQtyModel.update(
      updateData,
      {
        where: { ...whereCondition },
        returning: true, // Ensures we get the updated stock_quantity
      }
    );
    console.log("updateRows", updatedRows);
    console.log(updatedProduct.dataValues);
    if (updatedRows !== 0) {
      return {
        status: 200,
        msg:
          operation === "REDUCE"
            ? "stock updated successfully"
            : "stock restore successfully",
        result: updatedProduct.dataValues,
      };
    }
    return {
      status: 409,
      msg: "Stock is insufficient or product does not exist",
    };
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
