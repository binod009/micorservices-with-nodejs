import express from "express";
import {
  createProduct,
  findProductStock,
  getFilterProduct,
  getProductById,
  updateProductStock,
  deleteProduct,
} from "../controller/product.controller";
const product_route = express.Router();
import verifyUserToken from "../middleware/tokenverify";
import dotenv from "dotenv";
import { apiEventController } from "../controller/api-events.controller";

dotenv.config();

product_route
  .post("/products", verifyUserToken, createProduct)
  .get("/products/:id", verifyUserToken, getProductById)
  .get("/products/stock/:productid", verifyUserToken, findProductStock)
  .get("/products", verifyUserToken, getFilterProduct)
  .patch("/product/stock", verifyUserToken, updateProductStock)
  .patch("/api-event", verifyUserToken, apiEventController)
  .delete("/products/:id",verifyUserToken,deleteProduct); 

export default product_route;
