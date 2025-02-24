import express from "express";
// import { EditCustomerDetails } from "../controller/editcustomer.controller";
import { verifyToken } from "../middleware/verifyToken";
import { createCustomer } from "../controller/editcustomer.controller";

const customer_routes = express.Router();

// customer_routes.post("/customer", verifyToken, EditCustomerDetails)/;
customer_routes.post("/customer", createCustomer);

export default customer_routes;
