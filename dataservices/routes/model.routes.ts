import express from "express";
import { getCustomerModel } from "../controller/customer.controller";
import { getLoginModel } from "../controller/login.controller";
import { getCartModel } from "../controller/cart.controller";
import { getProductQuantityModel } from "../controller/productquantity.controller";
import { getProductModel } from "../controller/product.controller";
import { getWishListModel } from "../controller/wishlist.controller";
// import { getCartModel } from "../controller/cart.controller";
const model_routes = express.Router();


model_routes.get("/customer-model", getCustomerModel)
    .get("/login-model", getLoginModel)
    .get("/cart-model", getCartModel)
    .get("/productquantity-model", getProductQuantityModel)
    .get("/product-model", getProductModel)
    .get("/wish-model", getWishListModel);
    


export default model_routes;