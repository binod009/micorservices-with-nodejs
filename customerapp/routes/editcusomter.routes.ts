import express from "express";
import { EditCustomerDetails } from "../controller/editcustomer.controller";
import { verifyToken } from "../middleware/verifyToken";

const customer_routes = express.Router();

customer_routes.post("/customer", verifyToken, EditCustomerDetails);

export default customer_routes;
