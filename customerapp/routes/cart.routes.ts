import express from "express";
const cart_routes = express.Router();
import { addtoCart, getallCarts } from "../controller/cart.controller";

cart_routes.post("/cart", addtoCart).get("/cart", getallCarts);

export default cart_routes;
