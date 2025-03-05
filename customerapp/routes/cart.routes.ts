import express from "express";
const cart_routes = express.Router();
import { addtoCart, getallCarts } from "../controller/cart.controller";
import { ApiEventHandler } from "../controller/apievents.controller";
import { verifyToken } from "../middleware/verifyToken";

cart_routes.post("/cart",verifyToken, addtoCart)
    .get("/cart",verifyToken, getallCarts)
    .delete("/cart",verifyToken, ApiEventHandler)

export default cart_routes;
