import express from "express";
import { getCustomerModel } from "../controller/customer.controller";
const model_routes = express.Router();


model_routes.get("/customer-model", getCustomerModel)
    .get("/product-model");


export default model_routes;