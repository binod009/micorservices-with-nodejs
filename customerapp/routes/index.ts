import express from "express";
import customer_routes from "./editcusomter.routes";

import cart_routes from "./cart.routes";
import wishlist_route from "./wishlist.routes";
const app_router = express.Router();

app_router.use("/api/v1", cart_routes);
app_router.use("/api/v1", customer_routes);
app_router.use("/api/v1", wishlist_route);

export default app_router;
