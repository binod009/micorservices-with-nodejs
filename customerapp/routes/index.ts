import express from "express";
import customer_routes from "./editcusomter.routes";
import wishlist_route from "./wishlist.routes";
import cart_routes from "./cart.routes";
const app_router = express.Router();

app_router.use("/api/v1", customer_routes);
app_router.use("/api/v1", wishlist_route);
app_router.use("/api/v1",cart_routes);


export default app_router;
