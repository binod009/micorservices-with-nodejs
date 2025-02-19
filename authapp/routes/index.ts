const express = require("express");
const app_routes = express.Router();
import auth_routes from "./auth_route";
import post_routes from "./post_route";

app_routes.use("/api/v1", auth_routes);
app_routes.use("/api/v1", post_routes);

export default app_routes;
