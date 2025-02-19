import express from "express";
import order_routes from "./order.routes";
const app_routes = express();

app_routes.use("/api/v1", order_routes);

export default app_routes;
