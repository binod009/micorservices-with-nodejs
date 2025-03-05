import express from "express";
import {
  createOrder,
  deleteOrder,
  getallOrders,
  getOrder,
  updateOrderStatus,
} from "../controller/order.controller";
import {verifyToken } from "../middleware/verifyToken.middleware";
const order_routes = express.Router();

order_routes
  .post("/order",verifyToken,createOrder)
  .get("/order/:id", verifyToken, getOrder)
  .get("/order", verifyToken, getallOrders)
  .patch("/order/status/:order_id", verifyToken, updateOrderStatus)
  .delete("/order", verifyToken, deleteOrder);

export default order_routes;
