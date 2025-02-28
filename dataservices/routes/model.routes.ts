import express from "express";
import { getCustomerModel } from "../controller/customer.controller";
import { getLoginModel } from "../controller/login.controller";
// import { getCartModel } from "../controller/cart.controller";
const model_routes = express.Router();


model_routes.get("/customer-model", getCustomerModel)
    .get("/login-model", getLoginModel)
    // .get("/cart-model",getCartModel)


export default model_routes;